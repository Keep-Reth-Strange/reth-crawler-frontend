import { ThreeDots } from 'react-loader-spinner';

const Loading = () => (
  <ThreeDots
    height='80'
    width='80'
    radius='9'
    color='#4fa94d'
    ariaLabel='three-dots-loading'
    wrapperStyle={{}}
    visible={true}
  />
);

export default Loading;
