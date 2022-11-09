import { InView } from 'react-intersection-observer';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { IFullUser } from '../../interfaces';
import { Button } from '../ui';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
  loading: boolean;
  isShowNextPage: boolean;
  loadMoreUsers: (inView: boolean) => void;
  toggleFavoriteUser: (user: IFullUser) => void;
  toggleCurrentUser: (user: IFullUser | null) => void;
}

const CardsList = ({
  users,
  loading = false,
  isShowNextPage,
  loadMoreUsers,
  toggleFavoriteUser,
  toggleCurrentUser,
}: ICardsListProps) => {
  const isLoading = !!users.length && loading;

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
              <Button variant='icon' onClick={() => toggleFavoriteUser(user)}>
                <IconVariants size={35} color='gold' />
              </Button>
            </div>
          </div>
        );
      })}

      {isShowNextPage && (
        <InView
          as='div'
          className='Card-loadMoreBtn'
          onChange={loadMoreUsers}
        />
      )}

      {isLoading && <p className='CardList-loading'>Loading...</p>}
    </div>
  );
};

export default CardsList;
