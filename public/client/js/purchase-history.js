import { getPurchase } from "../services/checkout.js";
import { getFavorite } from "../services/favorites.js";

const account = JSON.parse(localStorage.getItem("account"));
const renderProducts = async () => {
 const dataComplete = await getPurchase({user_id:account.id,status:1},()=>{})
 const dataPending = await getPurchase({user_id:account.id,status:0},()=>{})

 const idCompletes = dataComplete.length > 0 ? dataComplete.map(data=>data.product_id) : []
 const idPendingss = dataPending.length > 0 ? dataPending.map(data=>data.product_id) : []



 const tblCompleteDiv = document.querySelector('.tblComplete')
 const tblPendingDiv = document.querySelector('.tblPending')

 console.table(dataPending);
 if(idCompletes.length > 0 ){
  
  tblCompleteDiv.innerHTML = ``
  dataComplete.forEach(data => {
    tblCompleteDiv.innerHTML += `
      <tr>
        <td><h3>${data.name}</h3></td>
        <td>
          <img src="/uploads/${
            favorite.imgs.split(",")?.[0]
          }" alt="" style='width:80px;height:80px'>
        </td>
      </tr>
    `
  });
 }
};

const handleForm = () => {
  // const name = document.getElementById("name");
 
};

export const handleFileHistory = async () => {
  renderProducts();
  handleForm();
  const countFavorite = document.querySelector(".icon_heart_alt~.tip");
  const handleErr = () => {};

  const listFoverite = await getFavorite({ user_id: account.id }, handleErr);
  countFavorite.textContent = listFoverite.length || 0;
 
};
