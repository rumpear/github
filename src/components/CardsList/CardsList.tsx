import { InView } from 'react-intersection-observer';
import { IFullUser } from '../../interfaces';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
  loading?: boolean;
  isShowNextPage: boolean;
  toggleFavoriteUser: (currUserLogin: string, isFavorite: boolean) => void;
  showCurrentUser: (user: IFullUser) => void;
  goToNextPage?: (inView: boolean) => void;
}

const CardsList = ({
  users,
  loading = false,
  isShowNextPage,
  toggleFavoriteUser,
  showCurrentUser,
  goToNextPage,
}: ICardsListProps) => {
  return (
    <div className='CardList'>
      {users.map((user: IFullUser) => {
        const favoritesBtnLabel = user.isFavorite ? 'Del' : 'Add';
        // console.log(user, 'CardsList');

        return (
          <div key={user.login} className='Card'>
            <div
              onClick={() => showCurrentUser(user)}
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
            <div className='Card-favBtn-wrapper'>
              <button
                type='button'
                className='Card-favBtn'
                onClick={() => toggleFavoriteUser(user.login, user.isFavorite)}
              >
                {favoritesBtnLabel}
              </button>
            </div>
          </div>
        );
      })}

      {isShowNextPage && (
        <InView as='div' className='Card-nextPageBtn' onChange={goToNextPage} />
      )}

      {loading && <p className='CardList-loading'>Loading...</p>}
    </div>
  );
};

export default CardsList;
