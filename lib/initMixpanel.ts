import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, { debug: true, track_pageview: true, ignore_dnt: true })
export default mixpanel;