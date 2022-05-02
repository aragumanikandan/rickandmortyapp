import './App.css';
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { List, PageHeader, Input, Space, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import "antd/dist/antd.css";
import { Card } from 'antd';

const { Meta } = Card;
const { Search } = Input;

function App() {
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages,setTotalPages] = useState(1);
  const [searchValue,setSearchValue] = useState('')

  useEffect(() => {
    loadMoreData();
  }, []);

  const onTextInputUpdate = (e) => {
    if(searchValue !== "" && e.currentTarget.value === "")
    {
      setCharacters([]);
      loadMoreData();
    }
    setSearchValue(e.currentTarget.value);
  };

  const searchCharacter = () =>
  {
    if(searchValue !== '')
    {
    setIsLoading(true);
    setTotalPages(1);
    setPage(1);
    fetch(`https://rickandmortyapi.com/api/character/?name=${searchValue}`)
      .then(res => res.json())
      .then(response => {
          setTotalPages(response.info.pages);
        setCharacters(response.results);
        setIsLoading(false);
      })
      .catch(error => console.log(error))
    }
  }

  const loadMoreData = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setPage(page+1);
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
      .then(res => res.json())
      .then(response => {
        if(page === 1)
        {
          setTotalPages(response.info.pages);
        }
        setCharacters([...characters,...response.results]);
        setIsLoading(false);
      })
      .catch(error => console.log(error))
  };

  return (
    <div className="site-page-header-ghost-wrapper">
    <PageHeader
      ghost={false}
      style={{height:70}}
      title="Rick Morty Characters"
      extra={[
        <Search placeholder="Enter character name to Search" onChange={onTextInputUpdate} onSearch={searchCharacter} style={{ width: 200 }} />
      ]}
    ></PageHeader>
    <div id="scrollableDiv" style={{ height: "calc(100% - 70px)", overflowY: "scroll" }}>
      <InfiniteScroll
        dataLength={characters.length}
        next={loadMoreData}
        hasMore={page <= totalPages}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
          dataSource={characters}
          renderItem={item => (
            <List.Item key={item.id}>              
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt={item.name} src={item.image} />}
              >
                <Meta title={item.name} description={`${item.status}-${item.species}`} />
                <Meta  description={`Last known location: ${item.location.name}`} />
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
    </div>
  );
}

export default App;
