import classNames from 'classnames';
import {
  AiOutlineStar,
  AiFillStar,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import { ARIA_LABELS, FOLLOWERS_LABELS } from '../../constants';
import { Button } from '../ui';
import { IUserCardProps } from './types';
import './UserCard.style.scss';

const UserCard = ({
  user,
  toggleCurrentUser,
  toggleFavoriteUser,
}: IUserCardProps) => {
  const IconVariants = user.isFavorite ? AiFillStar : AiOutlineStar;
  const isUserNameExist = !!user.name;

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
        <div
          className={classNames('UserCard-name', {
            'UserCard-login': isUserNameExist,
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
