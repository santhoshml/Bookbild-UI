import React, {Component} from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import ellipsis from 'text-ellipsis';
import { fetchContactAction } from '../actions/index';
import cUtils from '../utils/common_utils';

import { ic_aspect_ratio } from 'react-icons-kit/md/ic_aspect_ratio';
import { ic_business } from 'react-icons-kit/md/ic_business';
import { ic_business_center } from 'react-icons-kit/md/ic_business_center';
import { ic_format_list_bulleted } from 'react-icons-kit/md/ic_format_list_bulleted';
import { ic_people } from 'react-icons-kit/md/ic_people';
import { ic_shopping_cart } from 'react-icons-kit/md/ic_shopping_cart';
import { stack } from 'react-icons-kit/icomoon/stack';
import { spreadsheet } from 'react-icons-kit/iconic/spreadsheet';
import { legal } from 'react-icons-kit/fa/legal';
import { ic_attach_money } from 'react-icons-kit/md/ic_attach_money';       
import { trophy } from 'react-icons-kit/icomoon/trophy';       
import { user } from 'react-icons-kit/fa/user';
import { envelop } from 'react-icons-kit/icomoon/envelop';
import { Redirect } from "react-router";



const Icon20 = props => <SvgIcon size={props.size || 25} icon={props.icon} />;
const Icon19 = props => <SvgIcon size={props.size || 19} icon={props.icon} />;

const BaseContainer = props =>
<div
    style={{
        display: 'inline-block',
        paddingTop: 16,
        paddingBottom: 16,
        fontFamily: 'Roboto',
        width: 240,
        ...props.style
    }}
>
    {props.children}
</div>;

const Title = styled.div`
  padding: 12px;
`;

class Sidenav extends Component {

	componentWillMount(){
		// console.log('I am in header componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
        let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
        // get the user name
        this.props.fetchContactAction(user.contactId);
        this.setState({
            user: user,
            company : company
        });
	}

    onSelect(id, parent, ctx){
        // console.log('In onSelect, id:'+id+', parent:'+parent);
        if(id === 'rfp/rfpList'){
            this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
        } else if(id === 'rfp/myFavorites'){
            this.props.history.push(constants.ROUTES_MAP.RFP_FAVORITES_LIST+"/"+this.state.user.userId);
        } else if(id === 'rfp/myRFPList'){
            this.props.history.push(constants.ROUTES_MAP.RFP_COMPANY_LIST+"/"+this.state.company.companyId);
        } else if(id === 'rfp/createRFP'){
            this.props.history.push(constants.ROUTES_MAP.CREATE_RFP);
        } else if(id === 'ioi/myIOIList'){
            this.props.history.push(constants.ROUTES_MAP.IOI_LIST+"/"+this.state.company.companyId+"/"+constants.IOI_FOR_COMPANY);
        } else if(id === 'ioi/myFinalTermList'){
            this.props.history.push(constants.ROUTES_MAP.FINAL_TERM_LIST+"/"+this.state.company.companyId);
        } else if(id === 'dataRoom/documents'){
            this.props.history.push(constants.ROUTES_MAP.DOCS);
        } else if(id === 'dataRoom/manageWGL'){
            this.props.history.push(constants.ROUTES_MAP.WGL);
        } else if(id === 'dataRoom/quaterlyCompliance'){
            this.props.history.push(constants.ROUTES_MAP.QUARTERLY_COMPLIANCE);
        } else if(id === 'myAccount/myProfile'){
            this.props.history.push(constants.ROUTES_MAP.MY_PROFILE);
        } else if(id === 'myAccount/addUser'){
            this.props.history.push(constants.ROUTES_MAP.ADD_USER);
        } else if(id === 'myAccount/logout'){
            this.props.history.push(constants.ROUTES_MAP.LOGOUT);
        } else if(id === 'dataRoom/borrowerControlledAccess'){
            this.props.history.push(constants.ROUTES_MAP.BORROWER_CONTROLLED_ACCESS);
        } else if(id === 'concourse/messages'){
            this.props.history.push(constants.ROUTES_MAP.MESSAGES);
        }
        //  else{
        //     this.props.history.push('#');
        // } 
    }

    displayMyRFPLink(){
		if(this.state.user
			&& (this.state.user.role === constants.KEY_COMPANY
				|| this.state.user.role === constants.KEY_FINANCIAL_SPONSOR
				|| this.state.user.role === constants.KEY_SUPER_ADMIN
			)){
			return (
                <Nav id="myRFPList">
                    <NavText>My RFP List</NavText>
                </Nav>
			);
		}
    }
    
    displayCreateRFPLink(){
		if(this.state.user
			&& (this.state.user.role === constants.KEY_COMPANY
				|| this.state.user.role === constants.KEY_FINANCIAL_SPONSOR
				|| this.state.user.role === constants.KEY_SUPER_ADMIN )
			){
			return (
                <Nav id="createRFP">
                    <NavText>Create RFP</NavText>
                </Nav>
			);
		}
	}

	displayIOI(){
		if(this.state.user
			&& (this.state.user.role === constants.KEY_LENDER
			|| this.state.user.role === constants.KEY_SUPER_ADMIN)
		){
			return(
                <Nav id="ioi">
                    <NavIcon><Icon20 icon={ic_aspect_ratio} /></NavIcon>
                    <NavText> IOI </NavText>
                    <Nav id="myIOIList">
                        <NavText> My IOI List </NavText>
                    </Nav>
                    <Nav id="myFinalTermList">
                        <NavText> My Final Term List </NavText>
                    </Nav>
                </Nav>
			);
		} else {
			return(
                <Nav id="ioi">
                    <NavIcon><Icon20 icon={ic_aspect_ratio} /></NavIcon>
                    <NavText> IOI </NavText>
                    <Nav id="myIOIList">
                        <NavText>IOI List </NavText>
                    </Nav>
                    <Nav id="myFinalTermList">
                        <NavText>Final Term List </NavText>
                    </Nav>
                </Nav>
			);
        }
		//<li><Link to={"/createPitch/"+constants.PITCH_NEW}>Create a Pitch</Link></li>
		//<li><Link to="#">Default Pitch Settings</Link></li>
	}

	displayAddUserLink(){
		if((this.state.user && this.state.user.isAdmin && this.state.user.isAdmin=== true)
			||(this.state.user && this.state.user.isSuperAdmin && this.state.user.isSuperAdmin=== true)
		){
			return(
                <Nav id="addUser">
                    <NavText> Add a User </NavText>
                </Nav>
			);
		}
	}

	displayMyAccount(){
        return (
            <Nav id="myAccount">
                <NavIcon><Icon20 icon={user} /></NavIcon>
                <NavText> My Account </NavText>
                <Nav id="myProfile">
                    <NavText> My Profile </NavText>
                </Nav>
                <Nav id="myTeam">
                    <NavText> My Team </NavText>
                </Nav>
                {this.displayAddUserLink()}
                <Nav id="logout">
                    <NavText> Logout </NavText>
                </Nav>
            </Nav>
        );
	}

	displaySuperAdminDashBoard(){
		if(this.state.user && this.state.user.isSuperAdmin && this.state.user.isSuperAdmin === true){
			return (
                <Nav id="superAdmin">
                    <NavIcon><Icon20 icon={ic_people} /></NavIcon>
                    <NavText> SuperAdmin </NavText>
                </Nav>
            );
		}
	}

	displayConcourse(){
		return(
            <Nav id="concourse">
                <NavIcon><Icon20 icon={ic_people} /></NavIcon>
                <NavText> Concourse </NavText>
                <Nav id="network">
                    <NavText>Network</NavText>
                </Nav>
                <Nav id="forum">
                    <NavText>Forum</NavText>
                </Nav>
                <Nav id="messages">
                    <NavText>Messages</NavText>
                </Nav>
            </Nav>
		);
	}

	displayLegalDocs(){
		return(
            <Nav id="legalDocs">
                <NavIcon><Icon20 icon={legal} /></NavIcon>
                <NavText> Legal Docs </NavText>
                <Nav id="myPrecedents">
                    <NavText> My Precedents </NavText>
                </Nav>
                <Nav id="createPrecedents">
                    <NavText> Create Precedents </NavText>
                </Nav>
                <Nav id="searchPrecedents">
                    <NavText> Search Precedents </NavText>
                </Nav>
            </Nav>
		);
	}

	displayMarketData(){
		return(
            <Nav id="marketData">
                <NavIcon><Icon20 icon={ic_attach_money} /></NavIcon>
                <NavText> Market Data </NavText>
                <Nav id="sectorHeatmaps">
                    <NavText> Sector Heatmaps </NavText>
                </Nav>
                <Nav id="privateDebtTrends">
                    <NavText> Private Debt Trends </NavText>
                </Nav>
                <Nav id="economicData">
                    <NavText> Economic Data </NavText>
                </Nav>
                <Nav id="news">
                    <NavText> News </NavText>
                </Nav>
            </Nav>
		);
	}

    displayAccessControlNav(){
        if(this.state.user.role === constants.KEY_COMPANY || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
            return(
                <Nav id="borrowerControlledAccess">
                    <NavText>Access Control</NavText>
                </Nav>            
            );
        }
    }

	displayDataRoom(){
		return(
            <Nav id="dataRoom">
                <NavIcon><Icon20 icon={spreadsheet} /></NavIcon>
                <NavText> Data Room </NavText>
                <Nav id="newProject">
                    <NavText>New Project</NavText>
                </Nav>
                <Nav id="documents">
                    <NavText>Documents</NavText>
                </Nav>
                <Nav id="dealTeam">
                    <NavText>Deal Team</NavText>
                </Nav>
                <Nav id="manageWGL">
                    <NavText>Manage WGL</NavText>
                </Nav>
                <Nav id="quaterlyCompliance">
                    <NavText>Quarterly Compliance</NavText>
                </Nav>
                {this.displayAccessControlNav()}
            </Nav>
		);
	}

	displayTombstones(){
		return(
            <Nav id="tombstones">
                <NavIcon><Icon20 icon={trophy} /></NavIcon>
                <NavText> Tombstones </NavText>
                <Nav id="manageQuals">
                    <NavText> Manage Quals </NavText>
                </Nav>
                <Nav id="uploadTombstones">
                    <NavText> Upload Tombstones </NavText>
                </Nav>
            </Nav>			
		);
    }
    
    displayRFP(){
        return(
            <Nav id="rfp">
                <NavIcon><Icon20 icon={stack} /></NavIcon>
                <NavText> RFP </NavText>
                <Nav id="rfpList">
                    <NavText>RFP List</NavText>
                </Nav>
                <Nav id="myFavorites">
                    <NavText>My Favorites</NavText>
                </Nav>
                {this.displayMyRFPLink()}
                {this.displayCreateRFPLink()}
                <Nav id="parameterSearch">
                    <NavText>Parameter Search</NavText>
                </Nav>
            </Nav>
        );
    }
    
    linkToMsgs(){
        this.props.history.push(constants.ROUTES_MAP.MESSAGES);
    }

  render() {
    // console.log('I am in sidenav render');

    return (
    <BaseContainer style={{ background: '#2c3e50', width: '210px', color: '#FFF', height:'100%', position: 'absolute'}}>
    <SideNav highlightBgColor="#00bcd4" onItemSelection={this.onSelect.bind(this)}>
        <div style={{margin: '20px', fontStyle : 'italic', fontSize:'20px'}}>
            Hey {this.props.userContact ? cUtils.getNameToDisplayInSidebar(this.props.userContact.fullName) : ''} !! &nbsp; &nbsp;
            <a href="#" onClick={this.linkToMsgs.bind(this)}><Icon19 icon={envelop} /></a>
        </div>
        {this.displayRFP()}
        {this.displayIOI()}
        {this.displayConcourse()}
        {this.displayDataRoom()}
        {this.displayLegalDocs()}
        {this.displayMarketData()}
        {this.displayTombstones()}
        {this.displayMyAccount()}
        {this.displaySuperAdminDashBoard()}
    </SideNav>
    </BaseContainer>
    );
  }
};

function mapStateToProps(state) {
    let rObject = {};
    
    if(state.userProfile.contact){
        // console.log('state.userProfile.contact :'+JSON.stringify(state.userProfile.contact));
        rObject.userContact = state.userProfile.contact[0];
    }
    return rObject;
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchContactAction : fetchContactAction
    }, dispatch);
  }

export default connect(mapStateToProps, mapDispatchToProps)(Sidenav);