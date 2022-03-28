import argparse
import logging
import sys
from unittest import mock

from utils import handle_args

logging.basicConfig(level=logging.INFO)


def test_handle_args_no_input():
    sys.argv[1:] = []
    parser = handle_args()

    assert parser.get("host") == "0.0.0.0"
    assert parser.get("port") == "8000"
    assert parser.get("reload") == False
    assert parser.get("ssl") == True


@mock.patch(
    "argparse.ArgumentParser.parse_args",
    return_value=argparse.Namespace(
        host="0.0.0.0",
        port="8000",
        reload=False,
        ssl=True,
    ),
)
def test_handle_args_with_inputs(mocked_args):
    parser = handle_args()

    assert parser.get("host") == "0.0.0.0"
    assert parser.get("port") == "8000"
    assert parser.get("reload") == False
    assert parser.get("ssl") == True
