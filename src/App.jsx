import Tiptap from "./Tiptap.jsx";
import './App.css';
import CollabTiptap from "./CollabTiptap.jsx";
import React from 'react';
import {Layout, Breadcrumb, List, Typography} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const App = () => {
  const data = [
    {
      title: 'Article 1',
      id: '1'
    },
    {
      title: 'Article 2',
      id: '2'
    }
  ]


  const ArticleList = () => {
    const data = [
      {
        title: 'Article 1',
        id: '1'
      },
      {
        title: 'Article 2',
        id: '2'
      }
    ];
    const navigate = useNavigate();

    const goEdit = (item) => {
      navigate(`/edit/${item.id}`);
    };

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

  const EditArea = ({ match }) => {
    const { id } = useParams();
    // Now you can use the id to fetch the article and edit it
    return <div>Edit Area for article {id}</div>;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        文档树菜单
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
              <Route path="/" element={<ArticleList />} />
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

export default App;
