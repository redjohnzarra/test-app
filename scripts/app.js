var {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    Link
} = ReactRouter;


var destination = document.getElementById('container');

var App = React.createClass({
  render() {
    return (
      <div>
        <h1>Test APP</h1>
        <ul className="header">
          <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
          <li><Link to="/albums" activeClassName="active">Albums</Link></li>
          <li><Link to="/users" activeClassName="active">Users</Link></li>
        </ul>
        <div className="content">
            {this.props.children}
        </div>
      </div>
    )
  }
});

var allPosts = [];
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
        var args = {
            url: 'http://jsonplaceholder.typicode.com/posts',
            params: ''
        }
        var self = this;
        query._get(args, function(result){
            if (self.isMounted()) {
              self.setState({
                posts: result
              });
            }
        });
    },

    render(){
        var po = this.state.posts;

        if(po.length > 0){
            po = po.map(function(post, i){
                allPosts[post.id] = post;
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
        }else{
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
        if(this.isMounted()){
            this.setState({
                post: allPosts[pId]
            });
        }
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

var albums = [], albumData = [];

var IM = {
    Albums: React.createClass({
        getInitialState(){
            return {
                albums: []
            };
        },
        componentDidMount(){
            this.fetchImages()
        },
        fetchImages(){
            if(this.state.albums.length < 1){
                var args = {
                    url: 'http://jsonplaceholder.typicode.com/photos',
                    params: ''
                }
                var self = this;
                query._get(args, function(result){
                    if (self.isMounted()) {
                      self.setState({
                        albums: result
                      });
                    }
                });
            }
        },
        render(){
            var ai = this.state.albums;

            if(ai.length > 0){
                for(var ind in ai){
                    albums[ai[ind].albumId] = [];
                    albumData[ai[ind].albumId] = [];
                }

                for(var ind in ai){
                    var da = [];
                    var albumId = ai[ind].albumId;

                    albumData[albumId]['id'] = albumId;
                    albumData[albumId]['title'] = ai[ind].title;
                    albumData[albumId]['url'] = ai[ind].url;
                    albums[albumId].push(ai[ind]);
                }

                ai = albumData.map(function(alb, i){
                    var ttitle = truncate(alb.title, 15, '...');
                    return (
                        <div className="col-md-3" key={i}>
                          <div><Link className="btn btn-default btn-sm" to={"/albums/"+alb.id}><img className="thumbnail" src={alb.url} /><div>{ttitle}</div></Link></div>
                        </div>
                    );
                });
            }else{
                ai = <div className="imgs-container"><img src="img/loading.gif" /></div>
            }

            return(
                <div className="container">
                    <h2>Albums</h2>
                    <hr/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea eius quas expedita, suscipit. Eius rerum hic quas assumenda, dolorem fugiat!</p>
                    <div className="albums-container">
                        {ai}
                    </div>
                </div>
            );
        }
    }),
    AlbumEach: React.createClass({
        getInitialState() {
            return {
                album: []
            };
        },
        componentDidMount(){
            this.getAlbumEachData(this.props.params.id)
        },
        getAlbumEachData(albumId){
            if(this.isMounted()){
                this.setState({
                    album: albums[albumId] || []
                });
            }
        },
        render(){
            var ae = this.state.album;
            if(ae.length > 0){
                ae = ae.map(function(al, i){
                    return <a href={al.url} target="_blank" key={i}><div className="col-md-2"><img src={al.thumbnailUrl} /></div></a>
                });
            }else{

                ae = <div className="imgs-container"><img src="img/loading.gif" /></div>;
            }

            var albumTitle = albumData[this.props.params.id] != undefined ? albumData[this.props.params.id].title : '';
            return(
                <div className="container imgs-cont">
                    <h3>Images for Album <strong>{albumTitle}</strong>
                    </h3>
                    <hr/>
                    <div><Link className="pull-right" to="/albums">back to Albums</Link></div>
                    <br/><br/>
                    <div className="row">
                        {ae}
                    </div>
                </div>
            );
        }
    })
}

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var R = [];
        for (var i=0; i<this.length; i+=chunkSize)
            R.push(this.slice(i,i+chunkSize));
        return R;
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
            var args = {
                url: 'http://jsonplaceholder.typicode.com/users',
                params: ''
            }
            var self = this;
            query._get(args, function(result){
                if (self.isMounted()) {
                  self.setState({
                    users: result,
                    ajaxStatus: 'done'
                  });
                }
            });
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
            this.setState({
                ue: []
            });
            this.getUserData(nextProps.params.id)
        },
        getUserData(userId){
            var args = {
                url: 'http://jsonplaceholder.typicode.com/users/'+userId,
                params: ''
            }
            var self = this;
            query._get(args, function(result){
                if (self.isMounted()) {
                  self.setState({
                    ue: result
                  });
                }
            });
        },
        render(){
            var user = this.state.ue;
            var userData;
            if(user.length < 1){
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

var query = {
    _get : function(args, callback){
        var url = args.url;
        var params = args.params;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url+'?'+params);
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }
}

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="post/:id" component={Post} />
            <Route path="albums" component={IM.Albums} />
                <Route path="albums/:id" component={IM.AlbumEach} />
            <Route path="users" component={UC.Users}>
                <Route path=":id" component={UC.UserEach}/>
            </Route>
        </Route>
    </Router>,
    destination
);
