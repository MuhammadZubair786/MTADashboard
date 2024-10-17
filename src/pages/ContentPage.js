import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  CardActions,
  Box,
  TextareaAutosize,
} from '@mui/material';
// components

import { getPrivacy, getTerms, updatePrivacy, updateTerms } from '../service/user.service';

// import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  height: '50%',
  right: 'auto',
  bottom: 'auto',
  transform: 'translate(-50%, -50%)',

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ContentPage() {
  const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [terms, setterms] = useState({});
  const [privacy, setprivacy] = useState({});
  const handleprivacy = () => {
    setOpen(true);
    setpayload({ privacypolicy: privacy.privacypolicy, termscondition: '' });
  };
  const handleterms = () => {
    setOpen(true);
    setpayload({ privacypolicy: '', termscondition: terms.termscondition });
  };
  const [payload, setpayload] = useState({
    privacypolicy: '',
    termscondition: '',
  });
  const getdata = async () => {
    const data = await getPrivacy();

    setprivacy(data);
    const data1 = await getTerms();
    setterms(data1);
  };
  useEffect(() => {
    getdata();
  }, []);
  const handlepayloadupdate = (e) => {
    if (payload.termscondition !== '') {
      setpayload({ termscondition: e.target.value, privacypolicy: '' });
    } else {
      setpayload({ termscondition: '', privacypolicy: e.target.value });
    }
  };
  const updatecontent = async () => {
    if (payload.termscondition !== '') {
      const resp = await updateTerms(terms._id, { termscondition: payload.termscondition });
      if (resp.status === true) {
        setOpen(false);
        setpayload({
          privacypolicy: '',
          termscondition: '',
        });
        getdata();
      }
    } else {
      const resp = await updatePrivacy(privacy._id, { privacypolicy: payload.privacypolicy });
      if (resp.status === true) {
        setOpen(false);

        setpayload({
          privacypolicy: '',
          termscondition: '',
        });
        getdata();
      }
    }
  };
  return (
 <><Typography variant="h4" sx={{ mb: 5 }}>
        Content
      </Typography>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
          Terms and Conditions
          </Typography>
          {/* <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography> */}
          {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography> */}
          <Typography variant="body2">
            {terms.termscondition}
            {/* <br />
          {'"a benevolent smile"'} */}
          </Typography>
        </CardContent>
        <CardActions sx={{ float: 'right' }}>
          <Button size="large" onClick={handleterms}>
            Edit Terms And Condition
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
            Privacy Policy
          </Typography>
          {/* <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography> */}
          {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography> */}
          <Typography variant="body2">
            {privacy.privacypolicy}
            {/* <br />
          {'"a benevolent smile"'} */}
          </Typography>
        </CardContent>
        <CardActions sx={{ float: 'right' }}>
          <Button size="large" onClick={handleprivacy}>
            Edit Privacy And Policy
          </Button>
        </CardActions>
      </Card>

      {/* <ProductList products={PRODUCTS} /> */}
      {/* <ProductCartWidget /> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {payload.privacypolicy !== '' ? 'Privacy Policy' : 'Term And Condition'}
          </Typography>
          <TextareaAutosize
            // aria-label="empty textarea"
            placeholder={payload.privacypolicy !== '' ? 'Privacy Policy' : 'Term And Condition'}
            onChange={handlepayloadupdate}
            style={{ width: '90%', height: 'auto', ml:10, border: '1px solid blue' ,borderRadius:20, borderShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", padding:"6px",marginTop:"10px" }}

            // cols={12}
            rows={12}
            value={payload.privacypolicy !== '' ? payload.privacypolicy : payload.termscondition}
          />
          <Button onClick={updatecontent}>Update</Button>
        </Box>
      </Modal>
      </>
      
  );
}
