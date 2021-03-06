import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import Select from 'react-select';

import {loadMembers, showMember} from '../../../requests/members';

export default class MemberSelect extends React.Component {
  state = {
    defaultValue: null,
    defaultOptions: [],
  };

  static defaultProps = {
    name: 'user_id',
    onChange: () => {},
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.defaultValue) {
      this.loadInitialOption(this.props.defaultValue);
    }
  }

  loadInitialOption = async id => {
    try {
      this.setState({isInitializing: true});

      const response = await showMember(id);

      if (!this._isMounted) return;

      this.setState({
        defaultValue: response.data,
        defaultOptions: [response.data],
        isInitializing: false,
      });
    } catch (error) {
      this.setState({isInitializing: false});
      return;
    }
  };

  loadOptions = async q => {
    try {
      const response = await loadMembers({q, limit: 10});
      return response.data;
    } catch (err) {
      return [];
    }
  };

  render() {
    if (this.state.isInitializing) return <Select isLoading />;
    return (
      <AsyncSelect
        options={this.state.defaultOptions}
        name={this.props.name}
        defaultValue={this.state.defaultValue}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.id}
        cacheOptions={true}
        defaultOptions
        loadOptions={this.loadOptions}
        onChange={this.props.onChange}
      />
    );
  }
}
