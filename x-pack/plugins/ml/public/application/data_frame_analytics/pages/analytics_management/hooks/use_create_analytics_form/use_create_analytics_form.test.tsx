/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { mountHook } from 'test_utils/enzyme_helpers';

import { MlContext } from '../../../../../contexts/ml';
import { kibanaContextValueMock } from '../../../../../contexts/ml/__mocks__/kibana_context_value';

import { getErrorMessage, useCreateAnalyticsForm } from './use_create_analytics_form';

const getMountedHook = () =>
  mountHook(
    () => useCreateAnalyticsForm(),
    ({ children }) => (
      <MlContext.Provider value={kibanaContextValueMock}>{children}</MlContext.Provider>
    )
  );

describe('getErrorMessage()', () => {
  test('verify error message response formats', () => {
    const customError1 = {
      body: { statusCode: 403, error: 'Forbidden', message: 'the-error-message' },
    };
    const errorMessage1 = getErrorMessage(customError1);
    expect(errorMessage1).toBe('Forbidden: the-error-message');

    const customError2 = new Error('the-error-message');
    const errorMessage2 = getErrorMessage(customError2);
    expect(errorMessage2).toBe('the-error-message');

    const customError3 = { customErrorMessage: 'the-error-message' };
    const errorMessage3 = getErrorMessage(customError3);
    expect(errorMessage3).toBe('{"customErrorMessage":"the-error-message"}');

    const customError4 = { message: 'the-error-message' };
    const errorMessage4 = getErrorMessage(customError4);
    expect(errorMessage4).toBe('the-error-message');
  });
});

describe('useCreateAnalyticsForm()', () => {
  test('initialization', () => {
    const { getLastHookValue } = getMountedHook();
    const { state, actions } = getLastHookValue();

    expect(state.isModalVisible).toBe(false);
    expect(typeof actions.closeModal).toBe('function');
    expect(typeof actions.createAnalyticsJob).toBe('function');
    expect(typeof actions.openModal).toBe('function');
    expect(typeof actions.startAnalyticsJob).toBe('function');
    expect(typeof actions.setFormState).toBe('function');
  });

  test('open/close modal', () => {
    const { act, getLastHookValue } = getMountedHook();
    const { state, actions } = getLastHookValue();

    expect(state.isModalVisible).toBe(false);

    act(() => {
      // this should be actions.openModal(), but that doesn't work yet because act() doesn't support async yet.
      // we need to wait for an update to React 16.9
      actions.setIsModalVisible(true);
    });
    const { state: stateModalOpen } = getLastHookValue();
    expect(stateModalOpen.isModalVisible).toBe(true);

    act(() => {
      // this should be actions.closeModal(), but that doesn't work yet because act() doesn't support async yet.
      // we need to wait for an update to React 16.9
      actions.setIsModalVisible(false);
    });
    const { state: stateModalClosed } = getLastHookValue();
    expect(stateModalClosed.isModalVisible).toBe(false);
  });

  // TODO
  // add tests for createAnalyticsJob() and startAnalyticsJob()
  // once React 16.9 with support for async act() is available.
});
