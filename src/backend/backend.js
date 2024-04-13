// import { Server } from '@hocuspocus/server'
const {Server} = require('@hocuspocus/server')
const {Doc} = require("yjs");

function createInitialDocTemplate() {
  return new Doc();
  // do anything you want here
}

let storeData = null;

const server = Server.configure({
  port: 1234,
  async onConnect() {
    console.log('onConnect====')
  },
  async onStoreDocument(data) {
    /**
     * instance Hocuspocus
     * clientCount
     * context
     * document
     * documentName
     * update Unit8Array
     * socketId
     * Save to database. Example:
     * saveToDatabase(data.document, data.documentName);
     */
    console.log("onStoreDocument=====\n", data);
    storeData = data;
  },
  async onLoadDocument(data) {
    console.log("onLoadDocument====\n", data);  // Hocuspocus instance
    // return loadFromDatabase(data.documentName) || createInitialDocTemplate();
    return storeData ?? createInitialDocTemplate();
  },
})

// server.on("update", async (update, origin, doc) => {
//   // 获取最新的文档内容
//   const content = doc.getXmlFragment('default');
//   console.log(content);
//
//   // 这里假设你已经设置了一个数据库连接，并且有一个名为`Document`的模型
//   // 你需要根据你的实际情况来修改这部分代码
//   // const document = new Document({ content });
//   //
//   // try {
//   //   // 将文档保存到数据库
//   //   await document.save();
//   //   console.log('Document saved successfully');
//   // } catch (error) {
//   //   console.error('Failed to save document', error);
//   // }
// });

server.listen()
