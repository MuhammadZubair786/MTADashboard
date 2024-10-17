import PropTypes from 'prop-types';
import { Grid, Skeleton } from '@mui/material';
import ShopPostCard from './PostCard';

function PostList({ posts, isloading, handleOpenMenu, ...other }) {
  const renderSkeletonCards = () =>
    Array.from({ length: 8 }).map((_, index) => (
      <Grid key={`skeleton_${index}`} item xs={12} sm={6} md={3}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton />
        <Skeleton width="60%" />
      </Grid>
    ));

  const renderPosts = () =>
    posts.map((post) => (
      <Grid key={post._id} item xs={12} sm={6} md={3}>
        <ShopPostCard post={post} handleOpenMenu={handleOpenMenu} />
      </Grid>
    ));

  return (
    <Grid container spacing={3} {...other}>
      {isloading ? (
        renderSkeletonCards()
      ) : posts.length > 0 ? (
        renderPosts()
      ) : (
        <Grid item xs={12}>
          <h3>No Posts Found!</h3>
        </Grid>
      )}
    </Grid>
  );
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  handleOpenMenu: PropTypes.func,
  isloading: PropTypes.bool.isRequired,
};

export default PostList;
