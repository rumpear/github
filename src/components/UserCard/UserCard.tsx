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

      <div className='UserCard-textWrapper'>
        <p className='UserCard-name'>{user.name}</p>
        <div className={user.name ? 'UserCard-login' : 'UserCard-name'}>
          <a
            className='UserCard-link'
            href={user.html_url}
            target='_blank'
            rel='noreferrer'
          >
            {'@' + user.login}
          </a>
        </div>

        <p className='UserCard-bio'>{user.bio}</p>
        <p className='UserCard-bio'> {user.location}</p>
        <p className='UserCard-bio'> {user.email}</p>

        <div className='UserCard-followWrapper'>
          <div className='UserCard-some'>
            <p className='UserCard-text'>followers</p>
            <p className='UserCard-numbers'>{user.followers}</p>
          </div>
          <div className='UserCard-some'>
            <p className='UserCard-text'>following</p>
            <p className='UserCard-numbers'>{user.following}</p>
          </div>
          <div className='UserCard-some'>
            <p className='UserCard-text'>repos</p>
            <p className='UserCard-numbers'>{user.public_repos}</p>
          </div>
        </div>
      </div>

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
