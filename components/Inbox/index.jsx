import React, { useContext } from 'react';

import InboxCard from './InboxCard';
import useInbox from './hooks/useInbox';
import InboxModel from './InboxModel';
import InboxDetail from './inboxDetail';

import { formatCustomDate } from '@/utils/helper';
import IncentivioLoader from '@/widgets/incentivioLoader';
import AppContext from '@/utils/appContext';
import LayoutWrapper from '@/shared/layoutWrapper';

const InboxLists = ({ title = 'Inbox ' }) => {
  const { open, setOpen, msgList, loader, ...dt } = useInbox({});
  const { offerList } = useContext(AppContext);

  // Determine which list to display
  const displayList = title === 'Rewards' ? offerList : msgList;

  return (
    <LayoutWrapper>
      <div className='max-w-[680px] mx-auto'>
        <div className='text-[21px] font-bold   py-6'>{title}</div>
        <div className='flex gap-5 flex-col'>
          {loader.list ? (
            <div className='flex justify-center items-center h-[70dvh] w-full mx-auto'>
              <IncentivioLoader />
            </div>
          ) : (
            <>
              {displayList?.length ? (
                displayList.map((msg) => (
                  <InboxCard
                    msg={msg}
                    dt={dt}
                    key={msg?.offerId || msg?.id} // Ensure unique key
                    src={msg?.smallImage}
                    title={msg?.title}
                    content={msg?.shortDescription}
                    show={formatCustomDate(msg?.updatedDate)}
                    status={msg?.status}
                    setOpen={setOpen}
                  />
                ))
              ) : (
                <div className='flex justify-center items-center h-40 font-bold flex-col'>
                  <h2>You don&apos;t currently have any items in your {title.toLowerCase()}.</h2>
                  <h2>Check back in soon!</h2>
                </div>
              )}
            </>
          )}
        </div>

        <InboxModel open={open} setOpen={setOpen}>
          <InboxDetail
            setOpen={setOpen}
            data={dt.messageDetail}
            handleDelete={dt.handleDelete}
            loader={loader}
          />
        </InboxModel>
      </div>
    </LayoutWrapper>
  );
};

export default InboxLists;
