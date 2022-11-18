import classNames from 'classnames';
import {
  AiOutlineStar,
  AiFillStar,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import { ARIA_LABELS, FOLLOWERS_LABELS } from '../../constants';
import { Button } from '../ui';
import { IUserCardProps } from './types';
import './UserCard.scss';

const UserCard = ({
  user,
  toggleCurrentUser,
  toggleFavoriteUser,
}: IUserCardProps) => {
  const IconVariants = user.isFavorite ? AiFillStar : AiOutlineStar;
  const isNameExist = !!user.name;
  const isBioExist = !!user.bio;
  const isLocationExist = !!user.location;
  const isEmailExist = !!user.email;

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
        {isNameExist && <p className='UserCard-name'>{user.name}</p>}
        <div
          className={classNames('UserCard-name', {
            'UserCard-login': isNameExist,
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
        {isBioExist && <p className='UserCard-data'>{user.bio}</p>}
        {isLocationExist && <p className='UserCard-data'> {user.location}</p>}
        {isEmailExist && (
          <a
            href={'mailto:' + user.email}
            className='UserCard-data UserCard-email'
          >
            {user.email}
          </a>
        )}
        <div className='UserCard-follow'>
          <div className='UserCard-follow-wrapper'>
            <p className='UserCard-follow-text'>{FOLLOWERS_LABELS.followers}</p>
            <p className='UserCard-follow-numbers'>{user.followers}</p>
          </div>
          <div className='UserCard-follow-wrapper'>
            <p className='UserCard-follow-text'>{FOLLOWERS_LABELS.following}</p>
            <p className='UserCard-follow-numbers'>{user.following}</p>
          </div>
          <div className='UserCard-follow-wrapper'>
            <p className='UserCard-follow-text'>{FOLLOWERS_LABELS.repos}</p>
            <p className='UserCard-follow-numbers'>{user.public_repos}</p>
          </div>
        </div>
      </div>

      <div className='UserCard-currentBtn'>
        <Button
          variant='icon'
          onClick={() => toggleCurrentUser(null)}
          aria-label={ARIA_LABELS.closeUser}
        >
          <AiOutlineCloseCircle size={25} color='white' />
        </Button>
      </div>

      <div className='UserCard-favoriteBtn'>
        <Button
          variant='icon'
          onClick={() => toggleFavoriteUser(user)}
          aria-label={ARIA_LABELS.toggleFav}
        >
          <IconVariants size={25} color='gold' />
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
