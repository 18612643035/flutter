import 'package:flutter/material.dart';
import 'blue.dart';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(MaterialApp(
    navigatorKey: navigatorKey,
    title: 'menggunakan navigasi route',
    initialRoute: '/',
    routes: {
      '/': (context) => HalamanPertama(),
      '/kedua': (context) => HalamanKedua(),
      '/ble': (context) => NameOfYourWidget(),
    },
  ));
  initBle();
}


final GlobalKey<NavigatorState> navigatorKey = new GlobalKey<NavigatorState>();

class HalamanPertama extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('页面1'),
      ),
      body: Center(
        child: RaisedButton(
            child: Text('下一页'),
            onPressed: () {
              Navigator.pushNamed(context, '/ble'); // metode for route /kedua
            }),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.amberAccent,
        shape: const CircularNotchedRectangle(),
        child: Container(
          height: 50.0,
        ),
      ),
/*      floatingActionButton: FloatingActionButton(
          child: Icon(Icons.arrow_forward),
          onPressed: () {
            Navigator.pushNamed(context, '/ble');
          }),*/
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}

class HalamanKedua extends StatelessWidget {
  String _average = Wbp.average.toString();
  String _diastolic = Wbp.diastolic.toString();
  String _shrinkage = Wbp.shrinkage.toString();

  //HalamanKedua(this._average = Wbp.average.toString());
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('血压数据'),
      ),
      body: Center(
          child: Column(
        children: <Widget>[
          new Expanded(
            child: Text("平均压 $_average"),
          ),
          new Expanded(
            child: Text("舒张压 $_diastolic"),
          ),
          new Expanded(
            child: Text("舒张压 $_shrinkage"),
          )
        ],
      )),
      bottomNavigationBar: BottomAppBar(
        color: Colors.greenAccent,
        shape: const CircularNotchedRectangle(),
        child: Container(
          height: 50.0,
        ),
      ),
      floatingActionButton: FloatingActionButton(
          child: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushNamed(context, '/ble');
          }),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}

class NameOfYourWidget extends StatefulWidget {
  @override
  HalamanBlue createState() => HalamanBlue();

  void aa() {}
}

class HalamanBlue extends State<NameOfYourWidget> {
  List _bledb = ['12222'];

  void state() {
    List db = [];
    model.allBleNameAry.map((item) {
      db.add(item);
    }).toList();
    if (db.length > 0) {
      print(_bledb);
      this._bledb = db;
      setState(() {});
    }
  }
  void setData() async{  //本地存储
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("name", 'Huang');
    print(prefs.get('name'));
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('页面2'),
      ),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            new Expanded(
                child: ListView.builder(
                    itemCount: _bledb.length,
                    itemBuilder: (context, index) => new Container(
                          child: RaisedButton(
                              child: Text(_bledb[index]),
                              onPressed: () {
                                print("ss $_bledb");
                                connectionBle(_bledb[index]);
                              }),
                        ))),
            new Container(
              margin: const EdgeInsets.only(top: 8.0),
              child: RaisedButton(
                  // if button pressed then anonym metod to the halaman pertama
                  child: Text('检测蓝牙'),
                  onPressed: () async {
                    await startBle();
                    Future.delayed(Duration(milliseconds: 4000), () {
                      List db = [];
                      model.allBleNameAry.map((item) {
                        db.add(item);
                      }).toList();
                      setState(() {
                       this._bledb = db;
                      // _bledb = model.allBleNameAry.join('\n');
                      });
                    });
                  }),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.greenAccent,
        shape: const CircularNotchedRectangle(),
        child: Container(
          height: 50.0,
        ),
      ),
/*      floatingActionButton: FloatingActionButton(
          child: Icon(Icons.arrow_back),
          onPressed: () {
            setData();
            //Navigator.pushNamed(context, '/ble');
          }),*/
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}
