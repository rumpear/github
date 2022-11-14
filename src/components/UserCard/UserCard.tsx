import classNames from 'classnames';
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
  const isUserNameExist = !!user.name;
  const loginClassName = isUserNameExist ? 'UserCard-login' : 'UserCard-name';

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
        {isUserNameExist && <p className='UserCard-name'>{user.name}</p>}
        {/* <div className={loginClassName}> */}
        <div
          className={classNames({
            'UserCard-login': isUserNameExist,
            'UserCard-name': !isUserNameExist,
          })}
        >
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

        <div className='UserCard-follow'>
          <div className='UserCard-follow-wrapper'>
            <p className='UserCard-follow-text'>followers</p>
            <p className='UserCard-follow-numbers'>{user.followers}</p>
          </div>
          <div className='UserCard-follow-wrapper'>
            <p className='UserCard-follow-text'>following</p>
            <p className='UserCard-follow-numbers'>{user.following}</p>
          </div>
          <div className='UserCard-follow-wrapper'>
            <p className='UserCard-follow-text'>repos</p>
            <p className='UserCard-follow-numbers'>{user.public_repos}</p>
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
