/**
 * @jsx React.DOM
 */

/* globals React, Router, superagent */

// if (navigator.standalone) document.body.className += 'touch';
React.initializeTouchEvents(true);
var ReactTransitionGroup = React.addons.CSSTransitionGroup;

// (function () {})();

var app = app || {};

app.HOME = 'home';
app.STORY = 'story';
app.MENU = 'menu';

var Menu = React.createClass({
  render: function () {
    var classes = React.addons.classSet({
      'app__content--menu': true,
      'animated': true,
      'fadeIn': true
    });

    return (
      <div className={classes}>
        <h1>Menu</h1>
        <p>Bullets</p>
      </div>
    );
  }
});

var Feedback = React.createClass({
  getInitialState: function () {
    return {
      visible: true
    };
  },
  dismissFeedback: function (e) {
    e.preventDefault();
    this.setState({ visible: false });
  },
  render: function () {

    var classes = React.addons.classSet({
      'app__feedback': true,
      'animated': true,
      'fadeOutUpBig': !this.state.visible,
      'fadeInDownBig': this.state.visible
    });

    return (
      <div ref='feedback' className={classes}>
        <p><i className='fa fa-info-circle'></i>&nbsp;Clustter info feedback test!<span onClick={this.dismissFeedback} onTouchEnd={this.dismissFeedback} className='right'><i className='fa fa-times-circle-o'></i></span></p>
      </div>
    );
  }
});

var Story = React.createClass({
  render: function () {

    var classes = React.addons.classSet({
      'app__content--story': true,
      'animated': true,
      'fadeIn': true
    });

    return (
      <div className={classes}>
        <small>07/03/2014</small>
        <h1>Story Title</h1>
        <p>This is a dummy article. For now, because soon enough this will be dynamically filled in by sick news!</p>
        <p>This could also be a bullet-point list of the same sentences.</p>
        <small><i className='fa fa-anchor'></i> REFERENCES</small>
        <p>BBC</p>
        <p>Yahoo</p>
        <p>Guardian</p>
      </div>
    );
  }
});

var StoryFeed = React.createClass({
  render: function () {
    var stories = [
      {id: 1, title: 'Bafta fellowship for Rockstar Games', category: 'entertainment', excerpt: "The makers of games including the Grand Theft Auto series will be presented with a Bafta fellowship at this year's British Academy Games Awards"},
      {id: 2, title: "Russia 'demands Crimea surrender'", excerpt: "The Russian military has given Ukrainian forces in Crimea until 03:00 GMT on Tuesday to surrender or face an assault, Ukrainian defence sources say.", category: 'world'},
      {id: 3, title: "MtGOX gives bankruptcy details", category:'world'},
      {id: 4, title: "Twitter Booms in an unlikely buyout", category:'business'}
    ];

    var classes = React.addons.classSet({
      'app__content--feed': true,
      'animated': true,
      'fadeIn': true
    });
    
    var createStoryItem = function (item, index) {
      return (
        <a key={item.id} href={'#/story/' + index}>
          <li className={item.category}>
            <small>{item.category}</small>
            <h2>{item.title}</h2>
          </li>
        </a>
      );
    }.bind(this);

    return (
      <div className={classes}>
        <ul>
          {stories.map(createStoryItem)}
        </ul>
      </div>
    );
  }
});

var Clustter = React.createClass({
  getInitialState: function () {
    return {
      nowShowing: app.HOME,
      editing: null
    };
  },
  getStory: function (storyId) {
    this.setState({ nowShowing: app.STORY })
  },
  componentDidMount: function () {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, { nowShowing: app.HOME }),
      '/menu': setState.bind(this, { nowShowing: app.MENU }),
      '/story/:storyId': this.getStory
      
    });
    router.init('/');
  },
  handleMenu: function (event) {
    event.preventDefault();
    console.log('should trigger menu');
  },
  render: function () {
    var getContent = function () {
      var nowShowing = this.state.nowShowing;
      switch (nowShowing) {
        case app.HOME:
          return <StoryFeed />
          break;
        case app.STORY:
          return <Story />
          break;
        default:
          return <StoryFeed />
          break;
      }
    }.bind(this);
    return (
      <div className='app'>
        <div className='app__overlay'></div>
        <div className='app__topbar'>
          {(this.state.nowShowing !== app.HOME) ? <a href='#/' className='left'><i className='fa fa-chevron-left'></i></a> : ''}
          <a href='#/menu' className='right'><i className='fa fa-bars'></i></a>
        </div>
        <div className='app__content'>
          {getContent()}
        </div>
        <Feedback />
      </div>
    );
  }
});

React.renderComponent(
  <Clustter />,
  document.body
);