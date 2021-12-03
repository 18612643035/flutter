/*
使用方法
配置好环境： 
Android/iOS 权限设置完毕
导入库 flutter_blue 
1.初始化
initBle();
2.开始搜索蓝牙设备
startBle();
3.得到搜索到所有蓝牙设备名字数组(含名称过滤/空名、错误名)
getBleScanNameAry
4.从名字数组里面选择对应的蓝牙设备进行连接，传入需要连接的设备名在数组的位置
(其实是假连接，停止扫描，准备好需要连接的蓝牙设备参数)
connectionBle(int chooseBle)
5.正式连接蓝牙，并且开始检索特征描述符，并匹配需要用到的特征描述符等
discoverServicesBle()
6.断开蓝牙连接
endBle()
*写入数据  例子：dataCallsendBle([0x00, 0x00, 0x00, 0x00])
dataCallsendBle(List<int> value)
*收到数据
dataCallbackBle()
更多帮助博客：https://www.jianshu.com/p/bab40d5ecdee
*/

import 'dart:math';
import 'dart:typed_data';
import 'package:flutter_blue/flutter_blue.dart';
import 'dart:async';
import 'main.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter/material.dart';

class ble_data_model {
  /*
  蓝牙参数demo
  */
  FlutterBlue flutterBlue;
  BluetoothDevice device;
  Map<String, ScanResult> scanResults;
  List allBleNameAry;
  BluetoothCharacteristic mCharacteristic;
}
class Wbp {
  static int power; // null
  static int state; // null
  static int model; // 0
  static int mcuX;
  static int mcuY;
  static int mcu2X;
  static int mcu2Y;
  static int shrinkage;
  static int diastolic;
  static int average;
}
//蓝牙数据模型
ble_data_model model = new ble_data_model();

void initBle() {
  BluetoothDevice device;
  Map<String, ScanResult> scanResults = new Map();
  List allBleNameAry = [];
  BluetoothCharacteristic mCharacteristic;

  model.flutterBlue = FlutterBlue.instance;
  model.device = device;
  model.scanResults = scanResults;
  model.allBleNameAry = allBleNameAry;
  model.mCharacteristic = mCharacteristic;
}

void startBle() async {
  // 开始扫描
  model.flutterBlue.startScan(timeout: Duration(seconds: 4));
  // 监听扫描结果
  model.flutterBlue.scanResults.listen((results) {
    // 扫描结果 可扫描到的所有蓝牙设备
    for (ScanResult r in results) {
      model.scanResults[r.device.name] = r;
      if (r.device.name.length > 0) {
        // print('${r.device.name} found! rssi: ${r.rssi}');
        model.allBleNameAry.add(r.device.name);
        getBleScanNameAry();
      }
    }
   // HalamanBlue a = new HalamanBlue();
    //a.state();//循环结束
  });
}

List getBleScanNameAry() {
  //更新过滤蓝牙名字
  List distinctIds = model.allBleNameAry.toSet().toList();
  model.allBleNameAry = distinctIds;
  return model.allBleNameAry;
}

void connectionBle(String chooseBle) {
  for (var i = 0; i < model.allBleNameAry.length; i++) {
    bool isBleName = model.allBleNameAry[i].contains(chooseBle);
    if (isBleName) {
      ScanResult r = model.scanResults[model.allBleNameAry[i]];
      model.device = r.device;

      // 停止扫描
      model.flutterBlue.stopScan();

      discoverServicesBle();
    }
  }
}

void discoverServicesBle() async {
  print("连接上蓝牙设备...延迟连接");
  await model.device
      .connect(autoConnect: false, timeout: Duration(seconds: 10));
  print("连接成功");
  List<BluetoothService> services = await model.device.discoverServices();
  services.forEach((service) {
    var value = service.uuid.toString();
    print("所有服务值 --- $value");
    String bleid = service.uuid.toString().toUpperCase().substring(4, 8);
    if (bleid == "FFF0") {
      //血压服务值
      List<BluetoothCharacteristic> characteristics = service.characteristics;
      characteristics.forEach((characteristic) {
        var valuex = characteristic.uuid.toString();
        print("所有特征值 --- $valuex");
        String cid =
            characteristic.uuid.toString().toUpperCase().substring(4, 8);
        if (cid == "FFF4") {
          //血压器
          print("匹配到正确的特征值");
          model.mCharacteristic = characteristic;

          const timeout = const Duration(seconds: 30);
          Timer(timeout, () {
            bloodCallbackBle();
          });
        }
      });
    } else if (bleid == "FFE0") {
      //体温服务值
      List<BluetoothCharacteristic> characteristics = service.characteristics;
      characteristics.forEach((characteristic) {
        var valuex = characteristic.uuid.toString();
        print("所有特征值 --- $valuex");
        String cid =
            characteristic.uuid.toString().toUpperCase().substring(4, 8);
        if (cid == "FFE1") {
          print("匹配到正确的特征值");
          model.mCharacteristic = characteristic;

          const timeout = const Duration(seconds: 30);
          Timer(timeout, () {
            dataCallbackBle();
          });
        }
      });
    }
    // do something with service
  });
}

dataCallsendBle(List<int> value) {
  model.mCharacteristic.write(value);
}
List longData = [];
dataCallbackBle() async{ //E0蓝牙数据处理
  await model.mCharacteristic.setNotifyValue(true);
  model.mCharacteristic.value.listen((value) {
    List data = value;

    if (data.length == 0) {
      print("我是蓝牙返回数据 - 空！！");
      return;
    }
    if(longData.length > 0){ //叠加够字节数
        longData.addAll(data);
        int a = longData.length+2;
        int b = longData[1];
        if(a >= b){ //数据整合完毕
          data = longData;
          longData = [];
        }else{
          return;
        }
    }
    if(value[0] == 170 && value[1] > 18 && longData.length == 0){//数组超过20需要整合
      longData.addAll(data);
      return;
    }
    Fluttertoast.showToast(
        msg: "收到蓝牙数据",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1);
    print(data);
    data  = _hexTostring(data); //转16
    if (data[2] == '11') { //体温数据
      int a = _hexToInt(data[4]);
      int b = _hexToInt(data[5]);
      double db = ((b * 256) + a) * 0.01;
      print("体温 $db");
    }
    if (data[2] == '12') { //体温状态
      data = _hexToBinary(value);
      int power = int.parse(data[3].substring(data[3].length - 4), radix: 2);
      int connect = int.parse(data[3].substring(data[3][3]), radix: 2);
      print("体温电池电量$power");
      print("体温是否连接人体$connect");
    }
    if(data[2] == '43'){ //血氧状态
      data = _hexToBinary(value);
      int power = int.parse(data[3].substring(data[3].length - 4), radix: 2);
      print("血氧电池电量$power");
    }
    if(data[2] == '41'){
      int a = _hexToInt(data[4]);

      int pour = _hexToInt(data[32+3]);
      int blood = _hexToInt(data[33+3]);
      int pulse = _hexToInt(data[34+3]);
      int breathe = _hexToInt(data[35+3]);
      print("血氧数据编号 $a");
      print("灌注值 $pour");
      print("血氧值 $blood");
      print("脉率值 $pulse");
      print("呼吸值 $breathe");
    }
  });



  //model.mCharacteristic.write([0x33]);
}

//血压数据
bloodCallbackBle() async {
  await model.mCharacteristic.setNotifyValue(true);
  model.mCharacteristic.value.listen((value) {
    if (value == null) {
      print("我是蓝牙返回数据 - 空！！");
      return;
    }
    List data = _dbdeal(value);
    Fluttertoast.showToast(
        msg: "收到蓝牙数据",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1);
    //print("温度$db");

  });
}

void endBle() {
  model.device.disconnect();
}



List _dbdeal(value) {
  List data = [];
  if (value[2] == 42) {//血压状态
    data = _hexToBinary(value);
    //给对应属性赋值
    String power = data[3].substring(data[3].length - 4);
    String state = data[3][4];
    Wbp.power = int.parse(power, radix: 2);
    Wbp.state = int.parse(state, radix: 2);
  }else if(value[2] == 41){ //血压数据
    Wbp.shrinkage = int.parse(value[5].toRadixString(10));
      Wbp.diastolic = int.parse(value[6].toRadixString(10));
      Wbp.average = int.parse(value[7].toRadixString(10));
      BuildContext context = navigatorKey.currentState.overlay.context;
      Navigator.of(context).pushReplacementNamed('/kedua');//要跳转的页面
    HalamanKedua();
  }
  print("我是蓝牙返回数据 - $value");
}

//16转10进制
int _hexToInt(String hex) {
  //转10进制
  int val = 0;
  int len = hex.length;
  for (int i = 0; i < len; i++) {
    int hexDigit = hex.codeUnitAt(i);
    if (hexDigit >= 48 && hexDigit <= 57) {
      val += (hexDigit - 48) * (1 << (4 * (len - 1 - i)));
    } else if (hexDigit >= 65 && hexDigit <= 70) {
      // A..F
      val += (hexDigit - 55) * (1 << (4 * (len - 1 - i)));
    } else if (hexDigit >= 97 && hexDigit <= 102) {
      // a..f
      val += (hexDigit - 87) * (1 << (4 * (len - 1 - i)));
    } else {
      throw new FormatException("Invalid hexadecimal value");
    }
  }
  return val;
}

List _hexTostring(value){ //10转16
  List data = [];
  for (var i = 0; i < value.length; i++) {
    String dataStr = value[i].toRadixString(16);
    if (dataStr.length < 2) {
      dataStr = "0" + dataStr;
    }
    String dataEndStr = dataStr;
    data.add(dataEndStr);
  }
  return data;
}

List _hexToBinary(value){ //10转2进制
  List data = [];
  for (var i = 0; i < value.length; i++) {
    String dataStr = value[i].toRadixString(2);
    if (dataStr.length < 8) {
      for (var j = dataStr.length; j < 8; j++) {
        dataStr = "0" + dataStr;
      }
    }
    String dataEndStr = dataStr;
    data.add(dataEndStr);
  }
  return data;
}