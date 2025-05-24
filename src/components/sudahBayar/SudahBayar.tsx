import "./sudahBayar.scss"
import {topDealUsers} from "../../data.ts"

const SudahBayar = () => {
  return (
    <div className="sudahBayar">
      <h1>Sudah Membayar Bulan ini</h1>
      <div className="list">
        {topDealUsers.map(user=>(
          <div className="listItem" key={user.id}>
            <div className="user">
              <img src={user.img} alt="" />
              <div className="userTexts">
                <span className="username">{user.username}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            <span className="amount">${user.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SudahBayar