import { IItems } from '../../services/types';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IItems[];
}

const CardsList = ({ users }: ICardsListProps) => {
  return (
    <div className='Card-wrapper'>
      {users.map((user: IItems) => {
        return (
          <div key={user.login} className='Card'>
            <div className='Card-thumb'>
              <img
                className='Card-avatar'
                src={user.avatar_url}
                alt={user.login}
              />
            </div>
            <p className='Card-username'>{user.login}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CardsList;
