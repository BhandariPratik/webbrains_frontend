"use client"
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import withAuth from './withAuth';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeleteModal=(props)=> {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div onClick={() => props.setDeleteModal(false)}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          <h6 className='text-[#747474] text-center text-lg'>Are you sure you want to delete ?</h6>
          <div className='flex justify-around items-center'>
            <div>
              <button onClick={() => (props.deleteUser())} className='bg-black text-white px-2 py-1'>
                Yes
              </button>
            </div>
            <div>
              <button onClick={() => props.setDeleteModal(false)} className='bg-black text-white px-2 py-1'>
                No
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default withAuth(DeleteModal);