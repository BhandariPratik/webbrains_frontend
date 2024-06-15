import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import withAuth from './withAuth';
import { useAddeditdept } from '@/redux/api/department';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Department = (props) => {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dept, setDept] = useState('');
  const [error, setError] = useState('');
  const [editDept] = useAddeditdept();
  const ref = useRef(false)

  const validate = () => {
    if (!dept.trim()) {
      return 'Department is required';
    }
    return '';
  };

  useEffect(() => {
    if (props.deptDetail && ref) {
      setDept(props?.deptDetail?.department)
    }
    ref.current = true
  }, [])

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    let reqData = { 'department': dept }
    if (props.deptDetail) {
      reqData['edit'] = true,
      reqData['id'] = props?.deptDetail?._id
    }
    try {
      const res = await editDept(reqData);
      if (res?.data) {
        alert(res?.data?.message);
        props.onClose()
        props.refetch()
      } else {
        alert(res.error.data.message);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='text-center'>
            <h1 className='font-bold text-2xl'>{`${props?.deptDetail != null ? 'Edit' : 'Add'} Department`}</h1>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
              Department Name
            </label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              id="department"
              name="department"
              type="text"
              placeholder="Department"
              onChange={(e) => setDept(e.target.value)}
              value={dept}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className='text-center my-2'>
            <button
              type='button'
              className="cursor-pointer bg-pink-700 text-center hover:bg-pink-400 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default withAuth(Department);
