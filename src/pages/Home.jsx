import './index.css';
import CollabTiptap from "./CollabTiptap.jsx";
import React, {useState} from 'react';
import {Layout, Breadcrumb, List, Typography, Button} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import {addDocument, deleteDocument} from "@/api";
import {removeIf} from "@/utils";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([
    {
      title: 'Article 1',
      id: '1'
    },
    {
      title: 'Article 2',
      id: '2'
    }
  ])
  const goEdit = (item) => {
    navigate(`/edit/${item.id}`);
  };
  const requestAddDocument = () => {
    console.log("requestAddDocument")
    addDocument().then((res) => {
      setData(prev => [
        ...prev,
        {title: "未命名", ...res.data.data},
      ])
    })
  }
  const requestDeleteDocument = ({id}) => {
    deleteDocument().then((res) => {
      setData(prev => removeIf(prev, e => e.id !== id))
    })
  }

  const ArticleList = ({data, goEdit}) => {
    return (
      <List
        style={{ width: '45%' }}
        header={<Title level={3}>Article List</Title>}
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item onClick={() => goEdit(item)} style={{cursor: "pointer"}}>
            {item.title}
          </List.Item>
        )}
      />
    );
  };

  const EditArea = () => {
    const { id } = useParams();
    // Now you can use the id to fetch the article and edit it
    return <div>Edit Area for article {id}</div>;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <Button onClick={requestAddDocument}>新增</Button>
        <List
          header={<Title level={3}>Article List</Title>}
          bordered={false}
          dataSource={data}
          renderItem={item => (
            <List.Item onClick={() => goEdit(item)} style={{cursor: "pointer"}}>
              {item.title}
              <Button type="text" style={{marginLeft: "10px"}} onClick={() => requestDeleteDocument(item)}>删除</Button>
            </List.Item>
          )}
        />
      </Sider>
      <Layout>
        <Header>
          搜索栏\个人头像
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Routes>
              <Route path="/" element={<ArticleList data={data} goEdit={goEdit} />} />
              <Route path="/edit/:id" element={<EditArea />} />
            </Routes>
            {/*<List
              style={{ width: '45%' }}
              header={<Title level={3}>Article List</Title>}
              bordered
              dataSource={data}
              renderItem={item => (
                <List.Item onClick={() => goEdit(item)}>
                  {item.title}
                </List.Item>
              )}
            />*/}
            <div style={{ width: '45%' }}>
              {/* Add article description here */}
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default Home;