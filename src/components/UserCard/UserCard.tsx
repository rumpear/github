import { IFullUser } from '../../services/types';
import './UserCard.style.scss';

interface IUserCardProps {
  user: IFullUser;
  resetUser: () => void;
}

const UserCard = ({ user, resetUser }: IUserCardProps) => {
  return (
    <div className='UserCard'>
      <div className='UserCard-thumb'>
        <img
          className='UserCard-avatar'
          src={user.avatar_url}
          alt={user.login}
        />
      </div>
      <ul className='UserCard-text-wrapper'>
        <li className='UserCard-login'>{user.login}</li>
        <li className='UserCard-bio'>{user.bio}</li>
        <li className='UserCard-bio'> {user.location}</li>
        <li className='UserCard-bio'> {user.email}</li>
        <li className='UserCard-bio'>followers: {user.followers}</li>
        <li className='UserCard-bio'>following: {user.following}</li>
        <li className='UserCard-bio'>repos: {user.public_repos}</li>
        <li className='UserCard-bio'>
          <a className='UserCard-link' href={user.html_url}>
            Github Link
          </a>
        </li>
      </ul>
      <button className='UserCard-btn' type='button' onClick={resetUser}>
        Close
      </button>
    </div>
  );
};

export default UserCard;
