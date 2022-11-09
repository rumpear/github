import {
  AiOutlineStar,
  AiFillStar,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import { IFullUser } from '../../interfaces';
import { Button } from '../ui';
import './UserCard.style.scss';

interface IUserCardProps {
  user: IFullUser;
  toggleCurrentUser: (user: IFullUser | null) => void;
  toggleFavoriteUser: (user: IFullUser) => void;
}

const UserCard = ({
  user,
  toggleCurrentUser,
  toggleFavoriteUser,
}: IUserCardProps) => {
  const IconVariants = user.isFavorite ? AiFillStar : AiOutlineStar;

  return (
    <div className='UserCard'>
      <div className='UserCard-thumb'>
        <img
          className='UserCard-avatar'
          src={user.avatar_url}
          alt={user.login}
        />
      </div>
      <ul className='UserCard-textWrapper'>
        <li className='UserCard-login'>{user.login}</li>
        <li className='UserCard-bio'>{user.bio}</li>
        <li className='UserCard-bio'> {user.location}</li>
        <li className='UserCard-bio'> {user.email}</li>
        <li className='UserCard-bio'>followers: {user.followers}</li>
        <li className='UserCard-bio'>following: {user.following}</li>
        <li className='UserCard-bio'>repos: {user.public_repos}</li>
        <li className='UserCard-bio'>
          <a className='UserCard-link' href={user.html_url}>
            {'@' + user.login}
          </a>
        </li>
      </ul>

      <div className='UserCard-currentBtn'>
        <Button
          variant='icon'
          onClick={() => toggleCurrentUser(null)}
          aria-label='Close current user'
        >
          <AiOutlineCloseCircle size={25} color='white' />
        </Button>
      </div>

      <div className='UserCard-favoriteBtn'>
        <Button
          variant='icon'
          onClick={() => toggleFavoriteUser(user)}
          aria-label='Add or remove from favorites'
        >
          <IconVariants size={25} color='gold' />
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
