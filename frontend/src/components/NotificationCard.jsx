export const NotificationCard = ({notification}) => {
    return (
        <div className={'rounded-md w-450 bg-gray-200'}>
            <div className={'flex-auto justify-center items-center m-2 w-450'}>
                <div className={'flex items-center'}>
                    <img className={'h-9 w-9 rounded-lg m-2'} src={`${notification.senderID.avatar}`} alt={'img'}/>
                    <p className={'m-1 text-black'}>{notification.message}</p>
                </div>
            </div>
        </div>
    )
}