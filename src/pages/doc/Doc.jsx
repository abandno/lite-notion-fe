import React, {useEffect, useState} from 'react';
import {Layout, Breadcrumb, List, Typography, Button} from 'antd';
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {Route, Routes} from 'react-router-dom';
import {addDocument, deleteDocument, listDocument} from "@/api";
import {removeIf, toQueryString} from "@/utils";
import {Editor} from "@components/editor";
import {useMount} from "ahooks";
import DocMenuTree from "@/pages/doc/DocMenuTree";
import { EditorContextProvider } from "@/context";
import Header from '@/layouts/header';
import { useSettings } from '@/store/settingStore';
import { ThemeLayout, ThemeMode } from '#/enum';
import {useCurrentDocNode} from "@/store/docTreeStore";
import {getSpaceName} from "@/utils/tree-data-utils";

const {Content, Footer, Sider} = Layout;
const {Title} = Typography;

export const Doc = () => {
  const { themeLayout, themeMode } = useSettings();
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

  // useMount(() => {
  //   listDocument().then((res) => {
  //     setData(res.data.data);
  //   })
  // })

  // const [docId, setDocId] = useState(null);

  const goEdit = (item) => {
    // navigate(`/edit/${item.id}?` + toQueryString(item));
    const space = getSpaceName(item)
    navigate(`/doc/edit?id=${item.id}&space=${space}`);
    // setDocId(item.id)
  };

  const {currentDocNode, setCurrentDocNode} = useCurrentDocNode();
  useEffect(() => {
    if (currentDocNode != null) {
      console.log('currentDocNode changed, goEdit', currentDocNode)
      goEdit(currentDocNode)
    }
  }, [currentDocNode])

  const requestAddDocument = () => {
    console.log("requestAddDocument")
    addDocument().then((res) => {
      setData(prev => [
        ...prev,
        res.data.data,
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

  // const EditArea = () => {
  //   const { id , title} = useParams();
  //   // Now you can use the id to fetch the article and edit it
  //   return <div>Edit Area for article {id} {title}</div>;
  // };

  return (
    <EditorContextProvider>
      <Layout style={{minHeight: '100vh'}}>
        <Sider theme="light">
          {/*<Button onClick={requestAddDocument}>新增</Button>*/}
          {/*<List*/}
          {/*  header={<Title level={3}>Article List</Title>}*/}
          {/*  bordered={false}*/}
          {/*  dataSource={data}*/}
          {/*  renderItem={item => (*/}
          {/*    <List.Item onClick={() => goEdit(item)} style={{cursor: "pointer"}}>*/}
          {/*      {item.title}*/}
          {/*      <Button type="text" style={{marginLeft: "10px"}} onClick={() => requestDeleteDocument(item)}>删除</Button>*/}
          {/*    </List.Item>*/}
          {/*  )}*/}
          {/*/>*/}
          <DocMenuTree onSelectedChange={goEdit} />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div>
              <Outlet />
              {/* <Routes>
                <Route path="/" element={<ArticleList data={data} goEdit={goEdit}/>}/>
                <Route path="/edit/:id" element={<Editor />}/>
              </Routes> */}
              {
                // docId && <Editor id={docId} />
              }
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
              {/*<div style={{ width: '45%' }}>*/}
              {/*  /!* Add article description here *!/*/}
              {/*</div>*/}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </EditorContextProvider>
  );
};

export default Doc;
