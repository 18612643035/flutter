var dataPost = {
  "goods": [
    {
      "name": "Vlog",
      "type": -1,
      "foods": [
        {
          "name": "信息上传",
          "description": "咸粥",
        },
        {
          "name": "历史信息",
          "description": "",
        }
      ]
    },
    {
      "name": "客户信息",
      "type": -1,
      "foods": [
        {
          "name": "新增客户",
          "description": "system/client/addClient",
        },
        {
          "name": "查询客户",
          "description": "system/client/queryClient",
        },
        {
          "name": "修改客户",
          "description": "system/client/editClient",
        },
        {
          "name": "审核客户",
          "description": "system/client/auditClient",
        }
      ]
    },
    {
      "name": "合同信息",
      "type": -1,
      "foods": [
        {
          "name": "待审核",
          "description": "system/pact/auditPact",
        }
      ]
    },
    {
      "name": "售后信息",
      "type": -1,
      "foods": [
        {
          "name": "蜜瓜圣女萝莉杯",
          "description": "",
        }
      ]
    },
    {
      "name": "设备信息",
      "type": -1,
      "foods": [
        {
          "name": "扁豆焖面",
          "description": "", 
        }
      ]
    },
    {
      "name": "管理员",
      "type": -1,
      "foods": [
        {
          "name": "皮蛋瘦肉粥",
          "description": "咸粥",
        }
      ]
    },
    {
      "name": "退出登录",
      "type": -1,
      "foods": [
      ]
    }
  ],
  "todo": ["需要审核客户信息","需要审核合同信息","需要回访了"]
}
module.exports={
  dataPost: dataPost
}