import React from 'react'
import {Link} from 'react-router-dom'

export default (props) =>{
    const date = new Date(props.profile.createdAt)

    const handleDonation =(e)=>{
        e.preventDefault()
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
                    <h3>Tikslo suma: {props.profile.target_sum} Eur</h3>
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{date.toLocaleDateString('lt-LT')}</small>
                    </div>
                    <form onSubmit={handleDonation}>
                        <input className="form-control mt-3" type="text" placeholder="Jūsų vardas" name="donator"/>
                        <input className="form-control mt-1" type="number" placeholder="Aukojama suma" name="donation" />
                        <button className='btn btn-primary mt-1' type="submit">Aukoti</button>
                    </form>
                </div>
                
            </div>
        </div>
    )
}