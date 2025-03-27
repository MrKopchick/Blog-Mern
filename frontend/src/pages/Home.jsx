import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';

import {useDispatch, useSelector} from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  
  const dispatch = useDispatch();
  const {posts, tags } = useSelector(state => state.posts);
  const userData = useSelector((state) => state.auth.data); 

  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';  

  console.log(tags.items);
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, 
  []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Нове" />
        <Tab label="Популярне" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) => 
          isPostLoading ? (
            <Post key = {index} isLoading={true}/>
          ):(
            <Post 
              id = {obj._id}
              title = {obj.title}
              imageUrl={obj.imageUrl ?  `http://localhost:3002${obj.imageUrl}` : ''}
              user= {obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={[obj.tags]}
              isEditable = {userData?._id === obj.user._id}
            />
          ) )}
        </Grid>
        
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
