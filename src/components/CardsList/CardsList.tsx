import { IFullUser } from '../../services/types';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
}

const CardsList = ({ users }: ICardsListProps) => {
  return (
    <div className='Card-wrapper'>
      {/* : IFullUser */}
      {users.map((user, idx) => {
        return (
          <div key={user.login + idx} className='Card'>
            <div className='Card-thumb'>
              <img
                className='Card-avatar'
                src={user.avatar_url}
                alt={user.login}
              />
            </div>
            <div className='Card-text-wrapper'>
              <p className='Card-login'>{user.login}</p>
              <p className='Card-bio'>{user.bio}</p>
            </div>
            {/* <button type='button'>Fav</button> */}
          </div>
        );
      })}
    </div>
  );
};

export default CardsList;
