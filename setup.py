import os
from setuptools import setup, find_packages
 
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
 
setup(name='cyclesafe',
    version='1.0',
    author='Zhila',
    author_email='zfemadi@gmail.com',
    url='https://github.com/zemadi/CycleSafe_deploy',
    packages=find_packages(),
    include_package_data=True,
    description='cycle safe',
    install_requires=open('%s/requirements.txt' % os.environ.get('OPENSHIFT_REPO_DIR', PROJECT_ROOT)).readlines(),
)