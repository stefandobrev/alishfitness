import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = ({ loading, className }) => {
  return (
    <div className={`flex h-full items-center justify-center ${className}`}>
      <ClipLoader color='#4338ca' loading={loading} size={150} />
    </div>
  );
};
export default Spinner;
