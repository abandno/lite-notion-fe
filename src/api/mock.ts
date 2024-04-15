import Mock from 'mockjs';

const baseUrl = process.env.REACT_APP_API_URL || ""

const mockConfigs = [
  {
    path: "/api/document/add",
    method: "post",
    template: {
      code: 0,
      msg: "success",
      data: {
        id: "@integer(1, 100)",
        title: "@ctitle",
        content: "mock",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    }
  },
  {
    path: "/api/document/delete",
    method: "post",
    template: {
      code: 0,
      msg: "success",
      data: {},
    }
  },
]

for (const conf of mockConfigs) {
  Mock.mock(baseUrl + conf.path, conf.method, conf.template)
}
