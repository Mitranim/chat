const {PraxComponent, byPath} = require('prax')
const {mix} = require('../utils')
const {LoadingIndicator} = require('./loading-indicator')
const {LoginButtons} = require('./auth')
const {ErrorPanels} = require('./misc')

export class Participants extends PraxComponent {
  subrender ({deref}) {
    const refs = this.env.deref()
    const {props} = this

    const participants = deref(byPath(refs.participants, ['value']))
    const synced = deref(byPath(refs.participants, ['synced']))
    const error = deref(byPath(refs.participants, ['error']))

    const {user, synced: authSynced} = deref(refs.auth)
    const isAnon = authSynced && !user

    return (
      <div {...mix({className: 'col-start-stretch children-margin-1-v'}, props)}>
        <h3>Participants</h3>
        {error ?
        <ErrorPanels errors={[error]} /> : null}

        {!participants && !synced && !error ?
        <div className='row-center-center'>
          <LoadingIndicator className='font-1' />
        </div> :

        !participants && isAnon && !error ?
        <div className='flex-1 col-center-center text-center children-margin-0x5-v'>
          <h4>The chatroom is empty. Login to join!</h4>
          <LoginButtons />
        </div> :

        !participants && !error ?
        <div className='flex-1 col-center-center text-center children-margin-0x5-v'>
          <h4>The chatroom is empty. You should be listed here, which means something went wrong. Oops!</h4>
        </div> :

        <div className='children-margin-1-v overflow-y-scroll'>
          {_.map(participants, (participant, key) => (
            <Participant participant={participant} key={key} />
          ))}
        </div>}
      </div>
    )
  }
}

class Participant extends PraxComponent {
  subrender ({deref}) {
    const {props: {participant: {user: {uid, displayName, photoURL}}}} = this
    const userId = deref(byPath(this.env.deref().auth, ['user', 'uid']))

    return (
      <div className='row-start-center children-margin-0x5-h'>
        <span
          className='inline-block width-2em square bg-cover'
          style={{backgroundImage: photoURL ? `url(${photoURL})` : null}}
          />
        <span className={uid === userId ? 'weight-bold' : null}>{displayName}</span>
      </div>
    )
  }
}
