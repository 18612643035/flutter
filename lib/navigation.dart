import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new MaterialApp(
      title: 'Flutter 基础组件',
      theme: new ThemeData(
          primaryColor: Colors.red
      ),
      home: new MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  SelecteView(IconData icon, String text, String id){
    return new PopupMenuItem<String>(
      value: id,
      child: new Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          new Icon(
            icon,
            color: Colors.blue,
          ),
          new Text(text)
        ],
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Scaffold(
      //AppBar
      appBar: new AppBar(
        leading: new Icon(Icons.home),
        title: new Text('fultter基础组件学习'),
        backgroundColor: Colors.blue,
        centerTitle: true,
        actions: <Widget>[
          //非隐藏菜单
          new IconButton(
            icon: new Icon(Icons.add_alarm),
            tooltip: 'Add Alarm',
            onPressed: (){

            },
          ),
          //隐藏菜单
          new PopupMenuButton<String>(
            itemBuilder:(BuildContext context) =><PopupMenuItem<String>>[
              this.SelecteView(Icons.message, '发起群聊', 'A'),
              this.SelecteView(Icons.group_add, '添加服务', 'B'),
              this.SelecteView(Icons.cast_connected,'扫一扫码','C'),
            ],
            onSelected: (String action){
              switch (action) {
                case 'A':
                  {
                    print('发起群聊');
                  }
                  break;

                case 'B':
                  {
                    print('添加服务');
                  }
                  break;
                case  'C':
                  {
                    print('扫一扫');
                  }
                  break;
                default:
              }
            },
          )
        ],
      ),
      //draw
      drawer:null,

      //Body
      body:null,
      //NavigationBar
      bottomNavigationBar: null,
    );
  }
}