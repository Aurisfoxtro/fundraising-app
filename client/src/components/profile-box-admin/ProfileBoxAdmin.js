import React from 'react'
import {Link} from 'react-router-dom'

export default (props) =>{
    const date = new Date(props.profile.createdAt)

    const handleApprove =() => {

    }

    const handleDelete = () => {

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
                    <button className='btn btn-info m-2' onClick={handleApprove}>Patvirtinti</button>
                    <button className='btn btn-danger m-2' onClick={handleDelete}>Ištrinti</button>
                </div>
            </div>
        </div>
    )
}