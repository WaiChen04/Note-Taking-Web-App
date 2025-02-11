import StarFilled from '../assets/images/StarFilled.svg';
import StarUnFilled from '../assets/images/StarUnFilled.svg';
import Xmark from '../assets/images/Delete X mark.svg';

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important ? StarFilled : StarUnFilled;


  const formattedDate = new Date(note.date).toLocaleString('en-US', {
    weekday: 'short', // "Sun", "Mon", etc.
    year: 'numeric',
    month: 'short',  // "Jan", "Feb", etc.
    day: '2-digit',  // "01", "02", etc.
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,   // AM/PM format
  });

  return (
    <h2 className='note'>
      
      <button className='important' onClick={toggleImportance}>
        <img src={label} alt="Toggle Importances" width={25} height={25}/>
      </button>
      {note.content}
      
      <button className='important' onClick={() => deleteNote(note.id)}>
      <img src={Xmark} alt="Delete" width={25} height={25}/>

      </button>

      <span>{formattedDate}</span>
    </h2>
  );
};
export default Note;
