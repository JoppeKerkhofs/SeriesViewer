// this will be the homepage of the application, it will contain the list of all the shows and a search bar to search for shows.
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

// import needed components
import Show from '../Models/Show';
import ShowItem from './homepage/ShowItem';
import AddShow from './homepage/AddShow';
import ShowDetails from './homepage/ShowDetails';

export default function Home() {
  // get the list of shows from the local storage
  const shows = localStorage.getItem('shows');
  const [showAddModal, setShowAddModal] = useState(false); // State to control the visibility of the AddShow modal
  const [selectedShow, setSelectedShow] = useState<Show | null>(null); // State to store the selected show to display its details

  function toggleAddModal() {
    console.log('toggling add modal');
    // toggle the visibility of the AddShow modal
    setShowAddModal(!showAddModal);
  }

  function removeShow(id: string) {
    // remove the show from the local storage
    const showsParsed = JSON.parse(shows || '[]');
    const newShows = showsParsed.filter((show: Show) => show.id !== id);
    localStorage.setItem('shows', JSON.stringify(newShows));
    // remove the assets of the show
    const show = showsParsed.find((show: Show) => show.id === id);
    if (show !== undefined) {
      let location = show
        .name
        .toLowerCase()
        .replace(/\s/g, '');
      const fs = window.require('fs');
      // set the parent folder of the show, src/assets/location
      location = 'src/assets/' + location;
      // first, check if the folder of the show exists
      if (fs.existsSync(location)) {
        // remove the folder of the show
        fs.rmdirSync(location, { recursive: true });
      }
    }
    // reload the page
    window.location.reload();
  }

  // check if there are any shows in the local storage, if not, return a message and a button to add a show
  function checkShows() {
    if (shows === null) {
      return (
        <div className="text-center my-20">
          <h2 className="text-xl mb-3">No shows found</h2>
          <button onClick={toggleAddModal} className="rounded-[16px] bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300">Add your first show</button>
        </div>
      );
    } else {
      // json parse the shows
      const showsParsed = JSON.parse(shows);
      // if there are shows in the local storage, return the list of shows
      let showItems = showsParsed.map((show: Show) => (
        <ShowItem key={show.id} show={show} removeShow={removeShow} onClick={setSelectedShow} />
      ));

      return (
        <div className='h-full pb-10'>
          <div className="flex flex-wrap gap-4 mt-4">
            {showItems}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {selectedShow ? <ShowDetails id={selectedShow.id} setSelectedShow={setSelectedShow} /> : (
        <>
          <div className='flex justify-between'>
            <h1 className="text-2xl font-bold">Your Shows:</h1>
            <div>
              <button onClick={toggleAddModal} className="rounded-[16px] bg-transparent border-primary-1 border-2 p-2 text-onPrimary-1 font-medium hover:bg-primary-2 hover:border-primary-2 hover:text-onPrimary-2 duration-300"><AddIcon fontSize='large' /></button>
            </div>
          </div>
          <>{checkShows()}</>
          {/* Render AddShow modal based on showAddModal state */}
          {showAddModal && <AddShow toggleModal={toggleAddModal} />}
        </>
      )}
    </>
  );
};