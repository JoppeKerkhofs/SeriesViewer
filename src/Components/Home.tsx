// this will be the homepage of the application, it will contain the list of all the shows and a search bar to search for shows.

// import needed components
import Show from '../Models/Show';
import ShowItem from './homepage/ShowItem';

// import needed scripts
import { initializeShow } from '../scripts/addShow';

function Home() {
  // get the list of shows from the local storage
  const shows = localStorage.getItem('shows');

  function addShow() {
    // this function will show a modal to add a show, the user needs to input the name of the show

    // create a modal
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-background', 'bg-opacity-70', 'flex', 'justify-center', 'items-center');

    // create a form
    const form = document.createElement('form');
    form.classList.add('bg-white', 'p-4', 'rounded-xl', 'flex', 'flex-col', 'items-center', 'justify-center');

    // create a label
    const label = document.createElement('label');
    label.classList.add('text-black', 'font-medium', 'mb-3');
    label.textContent = 'Enter the name of the show:';
    form.appendChild(label);

    // create an input
    const input = document.createElement('input');
    input.classList.add('rounded-xl', 'p-2', 'mb-3', 'bg-gray-200');
    form.appendChild(input);

    // create a button
    const button = document.createElement('button');
    button.classList.add('rounded-[16px]', 'bg-primary-1', 'p-4', 'text-onPrimary-1', 'font-medium', 'hover:bg-primary-2', 'hover:text-onPrimary-2', 'duration-300');
    button.textContent = 'Add Show';
    button.addEventListener('click', () => {
      initializeShow(input.value);
      modal.remove();
    });

    // also remove the modal if the user clicks outside of it, but not if the user clicks inside the modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    form.appendChild(button);
    modal.appendChild(form);
    document.body.appendChild(modal);
  }

  // check if there are any shows in the local storage, if not, return a message and a button to add a show
  function checkShows() {
    if (shows === null) {
      return (
        <div className="text-center mt-20">
          <h2 className="text-xl mb-3">No shows found</h2>
          <button onClick={addShow} className="rounded-[16px] bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300">Add your first show</button>
        </div>
      );
    } else {
      // json parse the shows
      const showsParsed = JSON.parse(shows);
      // if there are shows in the local storage, return the list of shows
      return showsParsed.map((show: Show) => <ShowItem key={show.name} show={show} />);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold">List of Shows:</h1>
      <div>{checkShows()}</div>
    </>
  );
};

export default Home;