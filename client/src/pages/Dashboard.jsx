import React, { useEffect, useState } from 'react';
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth, useUser } from '@clerk/clerk-react';
import CreationItem from './CreationItem';
import useLanguage from '../hooks/useLanguage';
import axios from 'axios';
import { toast } from 'react-toastify';
//  firstName,fullName,createdAt,hasImage,imageUrl,lastSignInAt,updatedAt
const Dashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorGettingData, setErrorGettingData] = useState('');
  const [creations, setCreations] = useState([]);
  const [showAllCreations, setShowAllCreations] = useState(false);
  const { t, isRTL } = useLanguage();
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // console.log(user.createdAt);
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const token = await getToken();
        const { data } = await axios.get(
          BACKEND_URL + '/api/user/user-creations',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status === 'success') {
          console.log(data);
          setCreations(data.creations);
        }
      } catch (error) {
        toast.error(`Error loading dashboard data: ${error.message}`);
        setErrorGettingData(`Error loading dashboard data: ${error.message}`);
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    if (isLoaded && isSignedIn) {
      getDashboardData();
    }
  }, [isLoaded, isSignedIn, BACKEND_URL, getToken]);
  const handToggleShowAllCreations = () => {
    setShowAllCreations(!showAllCreations);
  };
  if (!isLoaded || isLoadingData) {
    return <DashboardSkeleton isRTL={isRTL} />;
  }

  // Handle case where user is not signed in
  if (!isSignedIn) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-xl mb-2">
            {isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in'}
          </h3>
          <p className="text-gray-400">
            {isRTL
              ? 'يجب تسجيل الدخول لعرض لوحة التحكم'
              : 'You need to be signed in to view the dashboard'}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return null;
  }
  console.log(user);
  const { fullName, createdAt, id, imageUrl, firstName, updatedAt } = user;

  return (
    <div className="h-full space-y-8  max-h-screen p-6 mt-12 md:mt-0">
      <div className="mb-6 border-b border-white/50 pb-6">
        <h3 className="text-xl tracking-wider mb-2">
          {t('dashboard.headings.info')}
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-end px-5 py-2 rounded-xl bg-black-light shadow-sm shadow-white/50">
            <h3 className="text-lg">{t('dashboard.userInfo.name')}</h3>
            <p className="text-white/70 text-sm">{fullName || firstName}</p>
          </div>
          <div className="flex gap-2 items-end px-5 py-2 rounded-xl bg-black-light shadow-sm shadow-white/50">
            <h3 className="text-lg">{t('dashboard.userInfo.photo')}</h3>
            <img className="w-6 h-6 rounded-full" src={imageUrl} />
          </div>
          <div className="flex gap-2 items-end px-5 py-2 rounded-xl bg-black-light shadow-sm shadow-white/50">
            <h3 className="text-lg">{t('dashboard.userInfo.joined')}</h3>
            <p className="text-white/70 text-sm">
              {createdAt.toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 items-end px-5 py-2 rounded-xl bg-black-light shadow-sm shadow-white/50">
            <h3 className="text-lg">{t('dashboard.userInfo.lastApdate')}</h3>
            <p className="text-white/70 text-sm">
              {updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 border-b border-white/50 pb-6">
        <h3 className="text-xl tracking-wider mb-2">
          {' '}
          {t('dashboard.headings.totalCreationAndPlan')}
        </h3>
        <div className="flex justify-start gap-4 flex-wrap">
          {/* Total Creation  */}
          <div className="flex items-center justify-between w-72 p-4 px-6 bg-black-light rounded-xl shadow-sm shadow-white/60">
            <div>
              <p className="text-sm">{t('dashboard.totalCreations')}</p>
              <h2 className="text-xl font-semibold">{creations?.length}</h2>
            </div>
            <div className="w-8 h-8 flex justify-center items-center rounded-xl bg-gradient-to-br from-[#cc2b5e] to-[#753a88]">
              <Sparkles className="w-4 text-white" />
            </div>
          </div>
          {/* Active plan */}
          <div className="flex items-center justify-between w-72 p-4 px-6 bg-black-light rounded-xl shadow-sm shadow-white/60">
            <div>
              <p className="text-sm">{t('dashboard.activePlan')}</p>
              <h2 className="text-xl font-semibold">
                {/* <Protect fallback={<p>Users that are signed-out can see this.</p>}>
              <p>Users that are signed-in can see this.</p>
            </Protect> */}
                <Protect plan="premium" fallback={isRTL ? 'مجانية' : 'Free'}>
                  {isRTL ? 'احترافية' : 'Premium'}
                </Protect>
              </h2>
            </div>
            <div className="w-8 h-8 flex justify-center items-center rounded-xl bg-gradient-to-br from-[#2193b0] to-[#6dd5ed]">
              <Gem className="w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl tracking-wider mb-2">
          {t('dashboard.headings.newCreations')}
        </h3>
        {errorGettingData ? (
          <p className="text-red-400">{errorGettingData}</p>
        ) : null}
        {!errorGettingData && creations.length && (
          <div>
            {creations.slice(0, 3).map((item) => (
              <CreationItem key={item.id} item={item} />
            ))}
            {creations.slice(3).length && (
              <div>
                {!showAllCreations ? (
                  <button
                    onClick={handToggleShowAllCreations}
                    className="font-semibold mt-2 mb-1 underline cursor-pointer text-brand"
                  >
                    Show More
                  </button>
                ) : null}
                {showAllCreations && (
                  <>
                    {creations.slice(3).map((item) => (
                      <CreationItem key={item.id} item={item} />
                    ))}
                    <button
                      onClick={handToggleShowAllCreations}
                      className="font-semibold mt-2 mb-1 underline cursor-pointer text-brand"
                    >
                      Show Less
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

const DashboardSkeleton = ({ isRTL }) => {
  return (
    <div className="h-full space-y-8 max-h-screen p-6 mt-12 md:mt-0 animate-pulse">
      {/* User Info Skeleton */}
      <div className="mb-6 border-b border-white/20 pb-6">
        <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex gap-2 items-center px-5 py-2 rounded-xl bg-gray-800 w-48"
            >
              <div className="h-6 bg-gray-600 rounded w-16"></div>
              <div className="h-4 bg-gray-600 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan & Creations Skeleton */}
      <div className="mb-6 border-b border-white/20 pb-6">
        <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
        <div className="flex justify-start gap-4 flex-wrap">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between w-72 p-4 px-6 bg-gray-800 rounded-xl"
            >
              <div>
                <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-600 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* New Creations Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-4 bg-gray-800 rounded-xl h-20"></div>
        ))}
      </div>
    </div>
  );
};
