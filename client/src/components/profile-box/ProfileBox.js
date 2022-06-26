import React from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default (props) =>{
    const date = new Date(props.profile.createdAt)
//--------------------------------------------------------------------
const [donationForm, setDonationForm] = useState({
    donator: '',
    donation: ''
})
const [showForm, setShowForm] = useState(true)
const [messages, setMessages] = useState({message: '', status: ''})
const navigate = useNavigate()

const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios
      .get("/api/profile/history/" + props.profile.id)
      .then((resp) => {
        if (resp.data.status === "success") {
          setDonations(resp.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

console.log("Donations: ", donations, "for profile id: ", props.profile.id)

const target = props.profile.target_sum
console.log("Target: ", target)

const surinkta = (donations, target_sum, profile) => {
    let viso = 0;
    donations.forEach((donations)=>{
        viso += parseInt(donations.donation)
    })
    if(viso >= target_sum){
        // setTimeout( ()=> {
        //     window.location.reload()
        // }, 500)
        profile.success = 1
        handleSuccess(profile)
    }
    // if(viso >= target_sum){
    //     setShowForm(false)
    // }
    // else{
    //     setShowForm(true)
    // }
    return viso
}

const handleSuccess = async(profile) =>{
    console.log("Profile: ", profile)
    await axios.put(`/api/profile/update/${profile.id}`, profile)
        .then((resp)=>{
            if(resp.data.status === "success"){
                // props.setMessages({
                //     message: resp.data.message,
                //     status: resp.data.status
                // })
            }
        })
        .catch(()=>{
            props.setMessages({
                message: "Profilis neįtrauktas į pilnai finansuotus",
                status: "danger"
            })
        })
}

const surinktaSuma = surinkta(donations, target, props.profile)
console.log("surinktaSuma: ", surinktaSuma)

const handleInputChange = (e) =>{
    setDonationForm({
        ...donationForm,
        [e.target.name]:e.target.value
    })
}

const handleValidation = () =>{
    for(let index of Object.keys(donationForm)){
        // if(index === 'hourly_rate' && profileForm[index]< 0)
        //     return false
        if(donationForm[index] === ''){
            return false
        }
    }
    return true    
}

    const handleDonation =(e)=>{
        e.preventDefault()

        if(!handleValidation()){
            setMessages({message: 'Netinkamai užpildyta forma', status: 'danger'})
            return false
        }

        // profileForm.UserId = userid

        // const form = new FormData();
        // Object.entries(donationForm).map((data) => {
        // form.append(data[0], data[1]);
        // });

        console.log("donationForm: ", donationForm)

        axios.post(`/api/profile/donate/:${props.profile.id}`, donationForm)
        .then(resp => {
            // console.log(resp.data)
            if(resp.data.status === 'success'){
                setTimeout( ()=> {
                    window.location.reload()
                }, 500)
                // setMessages({message: "Auka priimta", status: "success"}) //ar verta?
            }else{
                setMessages({message: resp.data.message, status: resp.data.status})
            }
            setDonationForm({
                donator: '',
                donation: ''
            })
        })
        .catch(()=>{
            setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }

    return(
        <div className="col">
            <div className="card shadow-sm">
                {/* <Link to={"/profile/" + props.profile.id}> */}
                <img className="bd-placeholder-img card-img-top"
                src={props.profile.profile_image}
                alt='Profilio nuotrauka'
                />
                {/* </Link> */}
                <div className="card-body">
                    <p className="card-text h5">{props.profile.description}</p>
                    <h3>Surinkta {surinktaSuma} Eur </h3>
                    <h3>iš {target} Eur</h3>
                    <h3>iki tikslo liko {target - surinktaSuma} Eur</h3>
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{date.toLocaleDateString('lt-LT')}</small>
                    </div>
                    {props.profile.success === 0 && (
                    <form onSubmit={(e) => handleDonation(e)}>
                        <input className="form-control mt-3" type="text" placeholder="Jūsų vardas" name="donator" value={donationForm.donator} onChange={(e) => handleInputChange(e)}/>
                        <input className="form-control mt-1" type="number" placeholder="Aukojama suma" name="donation" value={donationForm.donation} onChange={(e) => handleInputChange(e)}/>
                        <button className='btn btn-primary mt-1' type="submit">Aukoti</button>
                    </form>
                    )}
                    <div>
                        <table className='table mt-3'>
                            <tr>
                                <th colspan="2">Aukojimo istorija:</th>
                            </tr>
                            {donations.map((donation, index) => {
                                return(
                                <tr key={index}>
                                    <td>{donation.donator}</td>
                                    <td>{donation.donation} Eur</td>
                                </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    )
}