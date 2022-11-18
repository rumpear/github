import { useEffect } from 'react';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { Button } from '../ui';
import { ARIA_LABELS, MESSAGES_LABELS } from '../../constants';
import { useObserver } from '../../hooks';
import { IFullUser } from '../../interfaces';
import { ICardsListProps } from './types';
import './CardsList.scss';

const CardsList = ({
  users,
  isEndOfTheSearchResults,
  loading = false,
  isShowNextPage,
  loadMoreUsers,
  toggleFavoriteUser,
  toggleCurrentUser,
}: ICardsListProps) => {
  const { containerRef, isVisible } = useObserver();
  const isLoading = !!users.length && loading;

  useEffect(() => {
    if (isVisible) {
      loadMoreUsers();
    }
  }, [isVisible, loadMoreUsers]);

  return (
    <div className='CardList'>
      {users.map((user: IFullUser) => {
        const IconVariants = user.isFavorite ? AiFillStar : AiOutlineStar;

        return (
          <div key={user.login} className='Card'>
            <div
              onClick={() => toggleCurrentUser(user)}
              className='Card-container'
            >
              <div className='Card-thumb'>
                <img
                  className='Card-avatar'
                  src={user.avatar_url}
                  alt={user.login}
                />
              </div>
              <div className='Card-textWrapper'>
                <p className='Card-login'>{user.login}</p>
                <p className='Card-bio'>{user.bio}</p>
              </div>
            </div>

            <div className='Card-favBtnWrapper'>
              <Button
                variant='icon'
                onClick={() => toggleFavoriteUser(user)}
                aria-label={ARIA_LABELS.toggleFav}
              >
                <IconVariants size={35} color='gold' />
              </Button>
            </div>
          </div>
        );
      })}

      {isShowNextPage && <div ref={containerRef} className='Card-loadMore' />}

      {isLoading && (
        <p className='CardList-loading'>{MESSAGES_LABELS.loading}</p>
      )}

      {isEndOfTheSearchResults && (
        <p className='CardList-warning'>{MESSAGES_LABELS.endWarning}</p>
      )}
    </div>
  );
};

export default CardsList;
