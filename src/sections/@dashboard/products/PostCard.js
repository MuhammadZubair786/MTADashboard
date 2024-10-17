import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import { imgURL } from '../../../service/config';
import Iconify from '../../../components/iconify/Iconify';
// ----------------------------------------------------------------------

const StyledpostImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopPostCard.propTypes = {
  post: PropTypes.object,
};

export default function ShopPostCard({ post, handleOpenMenu }) {
  const { title, userLikes, userComments, isDeleted, user, postMedia, _id } = post;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {title && (
          <Label
            variant="filled"
            color={(title === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Label>
        )}  */}
        <StyledpostImg
          alt={postMedia?.length > 0 ? postMedia[0]?.file : 'card Img'}
          src={postMedia?.length > 0 ? imgURL + postMedia[0]?.file : '/assets/Placeholder.png'}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="h4" noWrap sx={{ fontSize: 18, fontStyle: 'bold' }}>
            {title}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              // sx={{
              //   color: 'text.disabled',
              //   textDecoration: 'line-through',
              // }}
            >
              {userLikes?.length}
            </Typography>

            <Iconify icon="mdi:cards-heart" sx={{ color: 'red', mt: 1 }} />
          </Typography>

          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              // sx={{
              //   color: 'text.disabled',
              //   textDecoration: 'line-through',
              // }}
            >
              {userComments?.length}
            </Typography>
            <Iconify icon="mdi:comments" />
          </Typography>
          {!isDeleted ? (
            <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={_id}>
              <Iconify icon={'eva:more-vertical-fill'} />
            </IconButton>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}
