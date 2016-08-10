var {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    Link
} = ReactRouter;


var destination = $('#container').get(0);

var App = React.createClass({
  render() {
    return (
      <div>
        <h1>Test APP</h1>
        <ul className="header">
          <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
          <li><Link to="/images" activeClassName="active">Images</Link></li>
          <li><Link to="/users" activeClassName="active">Users</Link></li>
        </ul>
        <div className="content">
            {this.props.children}
        </div>
      </div>
    )
  }
});

var Home = React.createClass({
    getInitialState(){
        return {
            posts: []
        };
    },
    componentDidMount(){
        this.getPosts()
    },

    getPosts(){
        $.get('http://jsonplaceholder.typicode.com/posts', function(result) {
            if (this.isMounted()) {
              this.setState({
                posts: result
              });
            }
        }.bind(this));
    },

    render(){
        var po = this.state.posts;

        po = po.map(function(post, i){
            var ti = truncate(post.title,10,'-');
            var tStr = truncate(post.body,50,'...');
            return (
                    <div className="col-lg-3" key={i}>
                      <h3>{post.title}</h3>
                      <p>{tStr}</p>
                      <p><Link className="btn btn-default btn-sm" to={"/post/"+post.id}>Read more</Link></p>
                    </div>
                );
        });

        if(!po.length){
            po = <div className="imgs-container"><img src="img/loading.gif" /></div>
        }
        return(
            <div className="container">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">Posts</h3>
                  </div>
                  <div className="panel-body">
                        <div className="row">
                            {po}
                        </div>
                  </div>
                </div>
            </div>
        );
    }
});

function truncate(str, len, ending){
        if (len == null) {
          len = 100;
        }
        if (ending == null) {
          ending = '...';
        }
        if (str.length > len) {
          return str.substring(0, len - ending.length) + ending;
        } else {
          return str;
        }
}

var Post = React.createClass({
    getInitialState(){
        return {
            post: []
        };
    },
    componentDidMount(){
        this.getPostData(this.props.params.id)
    },

    getPostData(pId){
        $.get('http://jsonplaceholder.typicode.com/posts/'+pId, function(result) {
            if (this.isMounted()) {
              this.setState({
                post: result
              });
            }
        }.bind(this));
    },

    render(){
        var p = this.state.post;
        if(p.length < 1){
            p = <div className="imgs-container"><img src="img/loading.gif" /></div>
        }else{
            p = <div><h2>{p.title}</h2><hr/><p>{p.body}</p><p><Link className="pull-right" to="/">back to Home</Link></p></div>
        }

        return(
            <div className="container post-cont">
                {p}
            </div>
        );
    }
});

var Images = React.createClass({
    getInitialState(){
        return {
            images: []
        };
    },
    componentDidMount(){
        this.fetchImages()
    },

    fetchImages(){
        $.get('http://jsonplaceholder.typicode.com/photos', function(result) {
            if (this.isMounted()) {
              this.setState({
                images: result
              });
            }
        }.bind(this));
    },

    render(){
        var iD = this.state.images;

        iD = iD.map(function(image, i){
            if(i < 21) return <img src={image.thumbnailUrl} key={i} />
        });

        if(!iD.length){
            iD = <img className='loading-img' src="img/loading.gif" />
        }

        return(
            <div className="container">
                <h2>Images</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea eius quas expedita, suscipit. Eius rerum hic quas assumenda, dolorem fugiat!</p>
                <p className="imgs-container">
                    {iD}
                </p>
            </div>
        );
    }
});

var UC = {
    Users : React.createClass({
        getInitialState(){
            return {
                users: [],
                searchString: '',
                ajaxStatus: ''
            };
        },
        handleChange: function(e){
            this.setState({searchString:e.target.value});
        },

        componentDidMount(){
            this.getUsers()
        },

        getUsers(){
            $.get('http://jsonplaceholder.typicode.com/users', function(result) {
                // console.log(result); return;
                if (this.isMounted()) {
                  this.setState({
                    users: result,
                    ajaxStatus: 'done'
                  });
                }
            }.bind(this));
        },

        render(){
            var uD = this.state.users;
            var ss = this.state.searchString.trim().toLowerCase();

            if(ss.length > 0){
                uD = uD.filter(function(u){
                    return u.name.toLowerCase().match(ss);
                });
            }

            uD = uD.map(function(user, i){
                    return <Link to={'/users/' + user.id} className="list-group-item" key={i}>{user.name}</Link>
                });

            if(!uD.length){
                if(this.state.ajaxStatus == 'done'){
                    uD = <div className="imgs-container">No results found.</div>
                }else{
                    uD = <div className="imgs-container"><img src="img/loading.gif" /></div>
                }
            }

            return(
                <div className="container">
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">Users</h3>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h5>Search for users:</h5>
                                    <div className="input-cont">
                                        <input id="users-input" type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Type here" />
                                    </div>
                                    <div className="row">
                                        {this.props.children}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="list-group clickable-li">
                                        {uD}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }),
    UserEach : React.createClass({
        getInitialState() {
            return {
                ue: []
            };
        },

        componentDidMount(){
            this.getUserData(this.props.params.id)
        },

        componentWillReceiveProps(nextProps) {
            this.getUserData(nextProps.params.id)
        },

        getUserData(userId){
            $.get('http://jsonplaceholder.typicode.com/users/'+userId, function(result) {
                // console.log(result); return;
                if (this.isMounted()) {
                  this.setState({
                    ue: result
                  });
                }
            }.bind(this));
        },

        render(){
            var user = this.state.ue;
            var userData;
            if($.isEmptyObject(user)){
                userData = <div className="imgs-container"><img src="img/loading.gif" /></div>
            }else{
                var dArr = [];
                for(var i in user){
                    var dStr = [];
                    dStr['index'] = i;
                    if(i == 'address'){
                        dStr['val'] = user[i].suite+', '+user[i].street+', '+user[i].city;
                    }else if(i == 'company'){
                        dStr['val'] = user[i].name;
                    }else{
                        dStr['val'] = user[i];
                    }
                    dArr.push(dStr);
                }

                userData = dArr.map(function(user, i){
                    return <div className="row" key={i}><div className="col-md-3"><label>{user.index}</label></div><div className="col-md-9">{user.val}</div></div>
                });
            }



            return(
                <div className="col-md-12">
                    <div className="panel panel-info">
                      <div className="panel-heading">
                        <h3 className="panel-title">User Details:</h3>
                      </div>
                      <div className="panel-body">
                        {userData}
                      </div>
                    </div>
                </div>
            );
        }
    })
}

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="post/:id" component={Post} />
            <Route path="images" component={Images} />
            <Route path="users" component={UC.Users}>
                <Route path=":id" component={UC.UserEach}/>
            </Route>
        </Route>
    </Router>,
    destination
);