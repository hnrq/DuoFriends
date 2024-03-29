import React, {Component} from 'react';
import {connect} from 'react-redux';
import List from 'material-ui/List';
import Input,{InputAdornment} from 'material-ui/Input';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import User from './User';
import SearchIcon from 'material-ui-icons/Search';
import FilterIcon from 'material-ui-icons/FilterList';
import Collapse from 'material-ui/transitions/Collapse';
import { reduxForm } from 'redux-form'
import {MenuItem} from 'material-ui//Menu';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import {getUsers} from '../../actions';

export class UserList extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
            search:{
                playername:'',
                roles:[],
                ranks:[],
                playstyles:[],
            }
        }

        this.renderUserList = this.renderUserList.bind(this);
        this.toggleAdvancedFilter = this.toggleAdvancedFilter.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
    }

    renderUserList(users) {
        return users
        .filter( user => this.state.search.playername !== '' ? user.nickName.toLowerCase().includes(this.state.search.playername.toLowerCase()) : true)
        .filter( user => this.state.search.roles.length > 0 ? this.state.search.roles.includes(user.mainRole) : true)
        .filter( user => this.state.search.ranks.length > 0 ? this.state.search.ranks.includes(user.league) : true)
        .filter( user => this.state.search.playstyles.length > 0 ? this.state.search.playstyles.includes(user.playStyle) : true)
        .map((user,index) => {
                return <User key={index} {...user}/>
            });

    }

    toggleAdvancedFilter(){
        this.setState({
            open: !this.state.open
        });
    }

    componentWillMount(){
        this.props.getUsers();
    }

    handleChangeSearch(searchParameter,e){
        e.preventDefault();
        this.setState({
            search:{
                ...this.state.search,
                [searchParameter]:e.target.value
            }
        });
    }

    render() {
        const {classes} = this.props;
        const roles = ["Top","Mid","Jungle","Bot","Support","Fill"];
        const ranks = ["Bronze","Silver","Gold","Platinum","Diamond","Master","Challenger"];
        const playstyles = ["Casual","Competitive"];
        return (
            <div>
                <div style={{backgroundColor:"#0f1015",position:'sticky',top:'55px',zIndex:'2'}}>
                    <Grid container alignItems="center" justify="center" spacing={16} style={{width:'100vw',margin:'0px'}}>
                        <Grid item xs={10}>
                        <Input fullWidth startAdornment={
                            <InputAdornment position="start"  className={classes.iconCenter}>
                                <SearchIcon/>
                            </InputAdornment>
                            } name="playername" placeholder="Player name..." onChange={(e)=>{this.handleChangeSearch('playername',e)}} disableUnderline value={this.state.search.playername} classes={{root:classes.searchInput,focused:classes.searchInput,input:classes.input}} />
                        </Grid>
                        <Grid item xs={2}  style={{textAlign:'center'}}>
                        <IconButton onClick={()=>{this.toggleAdvancedFilter()}}>
                            <FilterIcon className={this.state.open ? classes.advancedSearchOpen : {}}/>
                        </IconButton>
                        </Grid>
                    </Grid>
                <Collapse in={this.state.open} transitionDuration="auto" unmountOnExit>
                        <Grid style={{padding: "8px 8px"}} container alignItems="center" justify="center" spacing={16}>
                            <Grid item xs>
                                <Select name="role" value={this.state.search.roles} onChange={(e)=>{this.handleChangeSearch('roles',e)}} multiple disableUnderline className={classes.multipleSelect}>
                                    {roles.map(role => (
                                        <MenuItem key={role} value={roles.indexOf(role)+1}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs>
                                <Select name="rank" value={this.state.search.ranks} onChange={(e)=>{this.handleChangeSearch('ranks',e)}} multiple disableUnderline className={classes.multipleSelect}>
                                    {ranks.map(rank => (
                                        <MenuItem key={rank} value={rank.toUpperCase()}>
                                            {rank}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs>
                                <Select name="playstyle" value={this.state.search.playstyles} onChange={(e)=>{this.handleChangeSearch('playstyles',e)}} multiple disableUnderline className={classes.multipleSelect}>
                                    {playstyles.map(playstyle => (
                                        <MenuItem key={playstyle} value={playstyles.indexOf(playstyle)+1}>
                                            {playstyle}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                </Collapse>
                </div>
                <List style={{paddingBottom:'8vh',paddingTop:'8vh'}}>
                    {this.renderUserList(this.props.users)}
                </List>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {users: state.users};
}

function mapDispatchToProps(dispatch){
    return{
        getUsers: () => {
            dispatch(getUsers())
        }
    }
}

const styles = theme => ({
    searchInput:{
        padding:'0px 8px 0px 8px !important',
        borderRadius: '20px',
        backgroundColor: theme.palette.secondary[400],
        '&:before':{
            content: 'none'
        },
        alignItems: 'center',
    },
    multipleSelect:{
        borderRadius: '20px',
        backgroundColor: theme.palette.secondary[400],
        '&:before':{
            content: 'none'
        },
        width:'100%',
        alignItems: 'center',
        display: 'inline-block',
        alignSelf: 'center',
    },
    advancedSearchOpen:{
        color: theme.palette.primary[500]
    },
    input:{
        padding:'8px 0px !important',
    },
    iconCenter:{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        justifyContent: 'center',
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'search'
  })(withStyles(styles)(UserList)));
