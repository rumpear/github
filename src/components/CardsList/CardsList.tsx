import { useState } from 'react';
import { InView } from 'react-intersection-observer';
import { IFullUser } from '../../services/types';
import { UserCard } from '../UserCard';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
  nextPage: () => void;
  totalPages: number;
  page: number;
  loading: boolean;
}

const CardsList = ({
  users,
  nextPage,
  page,
  totalPages,
  loading,
}: ICardsListProps) => {
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);
  const showNextPage = page < totalPages;

  const handleCardClick = (currentUserLogin: string) => {
    const user = users.find((user) => user.login === currentUserLogin);
    const isUserExist = user ?? null;
    setCurrentUser(isUserExist);
  };

  const resetUser = () => {
    setCurrentUser(null);
  };

  const handlePageChange = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  return (
    <>
      <div className='Card-wrapper'>
        {users.map((user: IFullUser) => {
          return (
            <div
              key={user.login}
              className='Card'
              onClick={() => handleCardClick(user.login)}
            >
              <div className='Card-thumb'>
                <img
                  className='Card-avatar'
                  src={user.avatar_url}
                  alt={user.login}
                />
              </div>
              <div className='Card-text-wrapper'>
                <p className='Card-login'>{user.login}</p>
                <p className='Card-bio'>{user.bio}</p>
              </div>
              {/* <button type='button'>Fav</button> */}
            </div>
          );
        })}
        {showNextPage && (
          <InView
            as='div'
            className='Card-next-page'
            onChange={handlePageChange}
          />
        )}
      </div>
      {!!currentUser && <UserCard user={currentUser} resetUser={resetUser} />}
    </>
  );
};

export default CardsList;
