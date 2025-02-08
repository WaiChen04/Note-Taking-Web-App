import StarFilled from '../assets/images/StarFilled.svg';
import StarUnFilled from '../assets/images/StarUnFilled.svg';

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important ? StarFilled : StarUnFilled;

  return (
    <h2 className='note'>
      
      <button className='important' onClick={toggleImportance}>
        <img src={label} alt="Button Image" width={25} height={25}/>
      </button>
      {note.content}
      <button onClick={() => deleteNote(note.id)}>Delete</button>
    </h2>
  );
};
export default Note;
