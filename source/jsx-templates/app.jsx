/**
 * @jsx React.DOM
 */

/* globals React, Router, superagent */

// if (navigator.standalone) document.body.className += 'touch';
React.initializeTouchEvents(true);

// function supportsLocalStorage () {
//   try {
//     return 'localStorage' in window && window['localStorage'] !== null;
//   } catch (e) {
//     return false;
//   }
// };

// function saveStories (stories) {
//   if (!supportsLocalStorage()) { return false; }
//   console.log(stories);
//   console.log('saving stories');
//   localStorage["clustter.stories"] = JSON.stringify(stories);
//   return true;
// };

var app = app || {};

app.HOME = 'home';
app.STORY = 'story';
app.MENU = 'menu';

var Retry = React.createClass({
  refresh: function () {
    location.reload();
  },
  render: function () {
    return (
      <div className='app__content--retry' onClick={this.refresh} onTouchEnd={this.refresh}>
        <h2>{this.props.message}</h2>
        <h1><i className='fa fa-frown-o' /></h1>
        <p>Click here to try again.</p>
      </div>
    );
  }
});

var Menu = React.createClass({
  render: function () {
    return (
      <div className='app__content--menu animated fadeIn'>
        <h2>Reading Mode</h2>
        <p>Shows your stories in bullet points or 'continuous' text.</p>
        <div className='toggle'>
          <input type='checkbox' name="checkbox" id='chkbx' checked={this.props.bulleted} onChange={this.props.toggleBullet} />
          <label htmlFor='chkbx'><b></b></label>
        </div>
      </div>
    );
  }
});

var Feedback = React.createClass({
  render: function () {

    var classes = React.addons.classSet({
      'app__feedback': true,
      'animated': true,
      'bounceOutUp': !this.props.visible,
      'bounceInDown': this.props.visible,
    });

    var message = this.props.message;

    return (
      <div className={classes + ' ' + message.className}>
        <p><i className={'fa ' + message.icon }></i>&nbsp;{message.text}<span onClick={this.props.dismiss} onTouchEnd={this.props.dismiss} className='right'><i className='fa fa-times'></i></span></p>
      </div>
    );
  }
});

var Story = React.createClass({
  render: function () {
    document.body.scrollTop = 0; // always bring it to the top of the story
    var story = this.props.story;

    var createSentence = function (sentence, index) {
      if (sentence === '')
        return;
      else if (this.props.bulleted)
        return (<li key={index}>{sentence}</li>);
      else
        return (<p key={index}>{sentence}</p>);
    }.bind(this);

    var createRefs = function (ref, index) {
      var link = document.createElement('a');
      link.href = ref;
      return (<p key={index}><a target='_blank' href={ref}>{link.hostname}</a></p>);
    }.bind(this);
    
    return (
      <div className='app__content--story animated fadeIn'>
        <article>
          <header className={story.category.split(' ')[0].toLowerCase()}>
            <small>Clusttered on {moment(story.updated).format("L")}</small>
            <h1>{story.title}</h1>
          </header>
          {story.content.map(createSentence)}
        </article>
        <a href={'https://twitter.com/intent/tweet?text="' + story.title + '", summary via @getclustter — &url=' + window.location} target='_blank'>
          <div className='share'>
            <p><i className='fa fa-twitter fa-2x'></i></p>
            <h3>Share summary</h3>
          </div>
        </a>
        <div className='references'>
          <p><small><i className='fa fa-anchor'></i> REFERENCES</small></p>
          {story.refs.map(createRefs)}
        </div>
      </div>
    );
  }
});

var StoryFeed = React.createClass({
  render: function () {
    
    var createStoryItem = function (item, index) {
      return (
        <a key={index} href={'#/story/' + index}>
          <li className={item.category.split(' ')[0].toLowerCase()}>
            <small>{item.category}</small>
            <h2>{item.title}</h2>
          </li>
        </a>
      );
    }.bind(this);

    var stories = this.props.stories;
    
    if (stories.length === 0)
      return <Retry message='No stories available.'/>
    else {
      return (
        <div className='app__content--feed animated fadeIn'>
          <ul>{stories.map(createStoryItem)}</ul>
        </div>
      );
    }
  }
});

var Clustter = React.createClass({
  loadStories: function (cb) {
    var stories = this.state.stories;
    if (stories.length !== 0) { if (cb) cb(null, stories); return; } // if stories are already loaded there's no need to send another request
    this.setState({ isLoading: true }); // set status to loading
    superagent.get('http://192.168.0.3:3000/stories').timeout(3000).end(function (err, res) {
      this.setState({ isLoading: false });
      if (err) {
        this.handleFeedback(new ClustterError('Could not load stories.'));
      }
      else {
        this.handleFeedback(new ClustterInformation('Loaded latest stories.'));
        this.setState({ stories: res.body.stories });
        if (cb) cb(err, res.body.stories);
      } 
    }.bind(this));
  },
  getInitialState: function () {
    return {
      nowShowing: app.HOME,
      isLoading: false,
      isBulleted: true,
      stories: [],
      selectedStory: null,
      showFeedback: false,
      feedbackContent: {}
    };
  },
  componentDidMount: function () {
    var setState = this.setState;
    var router = Router({
      '/': [this.loadStories, setState.bind(this, { nowShowing: app.HOME })],
      '/menu': setState.bind(this, { nowShowing: app.MENU }),
      '/story/:storyId': this.getStory
    });
    router.init('/');
  },
  getStory: function (id) {
    id = parseInt(id);
    this.loadStories(function (err, stories) {
      this.setState({ selectedStory: stories[id], nowShowing: app.STORY });
    }.bind(this));
  },
  toggleBullet: function (event) {
    this.setState({ isBulleted: event.target.checked });
  },
  handleFeedback: function (message) {
    // activates feedback bar with a ClustterMessage - message
    setTimeout(this.dismissFeedback, 4200);
    this.setState({ feedbackContent: message, showFeedback: true});
  },
  dismissFeedback: function () { // dismisses feedback bar
    this.setState({ showFeedback: false }); 
  },
  render: function () {
    var getContent = function () {
      var nowShowing = this.state.nowShowing;
      switch (nowShowing) {
        case app.HOME:
          return <StoryFeed stories={this.state.stories} />
          break;
        case app.STORY:
          return <Story story={this.state.selectedStory} bulleted={this.state.isBulleted} />
          break;
        case app.MENU:
          return <Menu toggleBullet={this.toggleBullet} bulleted={this.state.isBulleted} />
          break;
        default:
          return <StoryFeed stories={this.state.stories} />
          break;
      }
    }.bind(this);
    return (
      <div className='app'>
        <div className='app__overlay'></div>
        <div className='app__topbar'>
          {(this.state.nowShowing !== app.HOME) ? <a href='javascript:history.back()' className='animated fadeIn left'>BACK</a> : ''}
          <a href='#/menu' className='right'><i className='fa fa-cog'></i></a>
        </div>
        <div className='app__content'>
          { (this.state.isLoading) ? <div className='app__content--loading animated fadeIn'><i className="fa fa-spinner fa-spin"></i></div> : getContent() }
        </div>
        <Feedback message={this.state.feedbackContent} visible={this.state.showFeedback} dismiss={this.dismissFeedback} />
      </div>
    );
  }
});

React.renderComponent(<Clustter />, document.body);