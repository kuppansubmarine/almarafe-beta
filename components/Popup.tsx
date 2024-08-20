'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useEffect, useState} from 'react';
import Image from "next/image";
import im from '@/Images/close.png';

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

export default function BasicModal() {
  const [approve, setApprove] = useState('');
  const [relevance, setRelevance] = useState('');
  const [recommend, setRecommend] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const key = setTimeout(handleOpen, 5000);
    return () => clearTimeout(key); // Clean up the timeout on component unmount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      'james': approve.trim(),
      'relevance': relevance.trim(),
      'share': recommend.trim(),
    };

    console.log(requestBody);
    setApprove('');
    setRelevance('');
    setRecommend('');

    const response = await fetch('https://almarabeta.azurewebsites.net/api/form_data', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-5 border-2 border-black shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-end items-end">
                <Image
                  onClick={handleClose}
                  className="cursor-pointer w-3 h-3 flex justify-end items-end"
                  src={im}
                  alt="close"
                />
              </div>
              <div className="flex flex-col py-5">
                <h1 className="font-semibold">
                  Would you like this search engine to be implemented at The James Cancer Center?
                </h1>
                <div className="flex">
                  <input
                    type="radio"
                    id="yes"
                    name="james"
                    value="yes"
                    onChange={(e) => setApprove(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="yes">
                    &#128513; Yes
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="maybe"
                    name="james"
                    value="maybe"
                    onChange={(e) => setApprove(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="maybe">
                    &#128528; Maybe
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="no"
                    name="james"
                    value="no"
                    onChange={(e) => setApprove(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="no">
                    &#128552; No
                  </label>
                </div>

                <h1 className="font-semibold">
                  How relevant were your search results for yourself or your patients?
                </h1>
                <div className="flex">
                  <input
                    type="radio"
                    id="veryRelevant"
                    name="relevance"
                    value="veryRelevant"
                    onChange={(e) => setRelevance(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="veryRelevant">
                    &#128513; Very Relevant
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="somewhatRelevant"
                    name="relevance"
                    value="somewhatRelevant"
                    onChange={(e) => setRelevance(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="somewhatRelevant">
                    &#128528; Somewhat Relevant
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="notRelevant"
                    name="relevance"
                    value="notRelevant"
                    onChange={(e) => setRelevance(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="notRelevant">
                    &#128552; Not Relevant
                  </label>
                </div>

                <h3 className="font-semibold mt-1">
                  How likely are you to recommend this platform to other researchers/physicians?
                </h3>
                <div className="flex">
                  <input
                    type="radio"
                    id="veryLikely"
                    name="share"
                    value="veryLikely"
                    onChange={(e) => setRecommend(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="veryLikely">
                    &#128513; Very Likely
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="somewhatLikely"
                    name="share"
                    value="somewhatLikely"
                    onChange={(e) => setRecommend(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="somewhatLikely">
                    &#128528; Somewhat Likely
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="notLikely"
                    name="share"
                    value="notLikely"
                    onChange={(e) => setRecommend(e.target.value)}
                  />
                  <label className="ml-2 text-sm" htmlFor="notLikely">
                    &#128552; Not Likely
                  </label>
                </div>

                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
